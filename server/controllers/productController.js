const { bannermodel, Product } = require("../models/productModel");
let catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path")
const fs = require("fs");
const base_url = process.env.NODE_ENV == "production" ? process.env.BASE_URL_LIVE : process.env.BASE_URL;

const createProductController = catchAsyncErrors(async (req, res, next) => {
    const files = req.files;
    const bannerFile = files.bannerImage?.[0];
    const galleryFiles = files.images || [];

    if (!bannerFile) {
        return res.status(400).json({ success: false, message: "Banner image is required." });
    }

    const bannerImage = {
        fileName: bannerFile.filename,
        url: `${base_url}/uploads/${bannerFile.filename}`,
    };

    const images = galleryFiles.map((file) => ({
        fileName: file.filename,
        url: `${base_url}/uploads/${file.filename}`,
    }));

    let {
        name,
        description,
        price,
        ratings = 0,
        category,
        stock,
        numOfReviews = 0,
        weight,
        discountPercentage,
        material,
        dimensions,
        gstRate,
        HSN,
        pricePerLot,
        shippingPricePerKM,
        packagingOptions
    } = req.body;


    // JSON parse
    if (typeof pricePerLot === "string") pricePerLot = JSON.parse(pricePerLot);
    if (typeof shippingPricePerKM === "string") shippingPricePerKM = JSON.parse(shippingPricePerKM);
    if (typeof packagingOptions === "string") packagingOptions = JSON.parse(packagingOptions);
    if (typeof dimensions === "string") dimensions = JSON.parse(dimensions);

    // LOT normalize
    const normalizedLotPricing = pricePerLot.map(lot => ({
        minQty: Number(lot.minQty),
        maxQty: Number(lot.maxQty),
        pricePerUnit: Number(lot.pricePerUnit),
    }));

    // SHIPPING normalize
    const normalizedShipping = shippingPricePerKM.map(s => ({
        minKM: Number(s.minKM),
        maxKM: Number(s.maxKM),
        pricePerKM: Number(s.pricePerKM),
    }));

    // ✅ PACKAGING normalize
    const normalizedPackaging = packagingOptions.map(p => ({
        type: p.type,
        maxWeight: Number(p.maxWeight),
        fee: Number(p.fee)
    }));

    const newProduct = {
        name,
        description,
        price,
        ratings,
        bannerImage,
        images,
        category,
        stock,
        numOfReviews,
        weight,
        discountPercentage,
        material,
        dimensions,
        gstRate,
        HSN,
        pricePerLot: normalizedLotPricing,
        shippingPricePerKM: normalizedShipping,
        packagingOptions: normalizedPackaging
    };

    const product = new Product(newProduct);
    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Created Successfully",
        data: product,
    });
});

let getAllProducts = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.find();
    res.status(200).json({
        success: true,
        data: products,
        message: "Products Find Successfully....."
    })
})

let countProduct = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.countDocuments();
    res.status(200).json({
        success: true,
        data: products,
        message: "Products Find Successfully"
    })
})

let getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        data: product,
    });

})

const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // 🧹 Delete banner image from disk
    if (product.bannerImage) {
        const bannerPath = path.join(__dirname, "../uploads/", product.bannerImage.url.split("/uploads/")[1]);
        if (fs.existsSync(bannerPath)) {
            fs.unlinkSync(bannerPath);
        }
    }

    // 🧹 Delete gallery images
    if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
            const filePath = path.join(__dirname, "../uploads/", img.url.split("/uploads/")[1]);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    }

    // 🗑️ Delete product from DB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
        data: product,
    });
});

const updateProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (req.body.pricePerLot) {
        req.body.pricePerLot = JSON.parse(req.body.pricePerLot);
    }

    if (req.body.shippingPricePerKM) {
        req.body.shippingPricePerKM = JSON.parse(req.body.shippingPricePerKM);
    }
    const files = req.files || {};
    const bannerFile = files.bannerImage?.[0];
    const galleryFiles = files.images || [];
    let bannerImageNew = "";
    let imagesNew = ""
    // 🔄 Parse dimensions
    if (req.body.dimensions && typeof req.body.dimensions === "string") {
        try {
            req.body.dimensions = JSON.parse(req.body.dimensions);
        } catch (err) {
            return next(new ErrorHandler("Invalid dimensions format", 400));
        }
    }

    // ✅ Handle bannerImage
    if (bannerFile && bannerFile.filename) {
        // Delete old banner
        if (product.bannerImage?.fileName) {
            const oldBannerPath = path.join(__dirname, "../uploads/", product.bannerImage.fileName);
            if (fs.existsSync(oldBannerPath)) fs.unlinkSync(oldBannerPath);
        }

        bannerImageNew = {
            fileName: bannerFile.filename,
            url: `${base_url}/uploads/${bannerFile.filename}`,
        };
    } else if (req.body.bannerImageData) {
        let dataImage = JSON.parse(req.body.bannerImageData);
        bannerImageNew = { fileName: dataImage && dataImage.url.split("/uploads/")[1], url: dataImage.url };
    } else {
        bannerImageNew = product.bannerImage;
    }

    // ✅ Handle gallery images
    let retainedImages = [];

    if (req.body.imagesData) {
        try {
            let dataImage = JSON.parse(req.body.imagesData);

            retainedImages = dataImage.map((img) => {
                return { fileName: img && img.url.split("/uploads/")[1], url: img.url }
            })
        } catch (err) {
            return next(new ErrorHandler("Invalid imagesData format", 400));
        }
    }

    // Delete old images that are NOT in retainedImages
    const retainedFileNames = retainedImages.map(img => img.fileName);
    product.images.forEach((img) => {
        if (!retainedFileNames.includes(img.fileName)) {
            const imgPath = path.join(__dirname, "../uploads/", img.fileName);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
    });

    // Map new uploaded images
    const newUploadedImages = galleryFiles.map((file) => ({
        fileName: file.filename,
        url: `${base_url}/uploads/${file.filename}`,
    }));

    // Combine old + new
    imagesNew = [...retainedImages, ...newUploadedImages];
    // ✅ Final Update
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body, bannerImage: bannerImageNew, images: imagesNew }, {
        new: true,
    });

    res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
        data: updatedProduct,
    });
});

let addBanners = catchAsyncErrors(async (req, res, next) => {
    let files = req.files || []

    let bannerimages = []
    files?.bannerImages?.map((v, i) => {
        bannerimages.push({ fileName: v.filename, url: `${base_url}/uploads/${v.filename}` })
    })

    let data = await bannermodel.insertMany(bannerimages);

    res.send({ success: true, message: "files uploaded successfully", bannerimages })
})

let getBanners = catchAsyncErrors(async (req, res, next) => {
    let data = await bannermodel.find({});
    res.send({ success: true, message: "files uploaded successfully", data })
})

let deleteBannerImage = catchAsyncErrors(async (req, res, next) => {

    const { bannerid } = req.params;

    // ✅ Find the product
    const bannerimage = await bannermodel.findById(bannerid);
    if (!bannerimage) {
        return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // ✅ Build the local file path
    const filePath = path.join(__dirname, "..", "uploads", bannerimage.fileName);

    // ✅ Delete the file from uploads folder (if exists)
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Error deleting file:", err);
        }
    });

    await bannermodel.findByIdAndDelete(bannerid)

    res.status(200).json({ success: true, message: "Banner image deleted successfully" });

});

// ✅ Get all unique product categories
const getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Product.distinct("category");
    res.status(200).json({
        success: true,
        data: categories,
    });

});

// ✅ Get products by category
const getProductsByCategory = catchAsyncErrors(async (req, res, next) => {
    const { category } = req.params;
    const products = await Product.find({ category: { $regex: category, $options: "i" } });
    res.status(200).json({
        success: true,
        category,
        data: products,
    });
})

module.exports = { getAllCategories, getProductsByCategory, createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct, addBanners, getBanners, deleteBannerImage }


