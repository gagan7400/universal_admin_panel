const { bannermodel, Product } = require("../models/productModel");
let catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const fs = require("fs");
const base_url = process.env.NODE_ENV == "production" ? process.env.BASE_URL_LIVE : process.env.BASE_URL;
const {
    uploadImageBuffer,
    toStoredImage,
    removeStoredImage,
    publicIdFromCloudinaryUrl,
} = require("../utils/cloudinaryUpload");
const uploadsDir = path.join(__dirname, "../uploads");

const createProductController = catchAsyncErrors(async (req, res, next) => {
    const files = req.files;
    const bannerFile = files.bannerImage?.[0];
    const galleryFiles = files.images || [];

    if (!bannerFile) {
        return res.status(400).json({ success: false, message: "Banner image is required." });
    }

    const bannerUploaded = await uploadImageBuffer(
        bannerFile.buffer,
        bannerFile.mimetype,
        "products/banner"
    );
    const bannerImage = toStoredImage(bannerUploaded);

    const images = await Promise.all(
        galleryFiles.map(async (file) => {
            const up = await uploadImageBuffer(file.buffer, file.mimetype, "products/gallery");
            return toStoredImage(up);
        })
    );

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
        productType: lot.productType,
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
        maxWeightPerPackage: Number(p.maxWeightPerPackage),
        maxItemsPerPackage: Number(p.maxItemsPerPackage),
        feePerPackage: Number(p.feePerPackage)
    }));
    console.log({
        pricePerLot: normalizedLotPricing,
        shippingPricePerKM: normalizedShipping,
        packagingOptions: normalizedPackaging
    })
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
        packagingOptions: normalizedPackaging,
        packagingTypes: [
            "Palletised", "BulkBag", "Loose Packing", "Special Packing"]
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
        message: "Products Find Successfully..."
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

    if (product.bannerImage) {
        await removeStoredImage(product.bannerImage, uploadsDir);
    }
    if (product.images?.length) {
        for (const img of product.images) {
            await removeStoredImage(img, uploadsDir);
        }
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
    console.log(req.body.pricePerLot)
    if (req.body.shippingPricePerKM) {
        req.body.shippingPricePerKM = JSON.parse(req.body.shippingPricePerKM);
    }
    if (req.body.packagingOptions) {
        req.body.packagingOptions = JSON.parse(req.body.packagingOptions);
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

    if (bannerFile && bannerFile.buffer) {
        await removeStoredImage(product.bannerImage, uploadsDir);
        const up = await uploadImageBuffer(
            bannerFile.buffer,
            bannerFile.mimetype,
            "products/banner"
        );
        bannerImageNew = toStoredImage(up);
    } else if (req.body.bannerImageData) {
        let dataImage = JSON.parse(req.body.bannerImageData);
        bannerImageNew = {
            fileName:
                dataImage?.fileName ||
                (dataImage?.url && dataImage.url.includes("/uploads/")
                    ? dataImage.url.split("/uploads/")[1]
                    : publicIdFromCloudinaryUrl(dataImage?.url)) ||
                "",
            url: dataImage.url,
        };
    } else {
        bannerImageNew = product.bannerImage;
    }

    // ✅ Handle gallery images
    let retainedImages = [];

    if (req.body.imagesData) {

        try {
            let dataImage = JSON.parse(req.body.imagesData);

            retainedImages = dataImage.map((img) => ({
                fileName:
                    img?.fileName ||
                    (img?.url && img.url.includes("/uploads/")
                        ? img.url.split("/uploads/")[1]
                        : publicIdFromCloudinaryUrl(img?.url)) ||
                    "",
                url: img.url,
            }));
        } catch (err) {
            return next(new ErrorHandler("Invalid imagesData format", 400));
        }
    }

    const retainedFileNames = retainedImages.map((img) => img.fileName);
    for (const img of product.images) {
        if (!retainedFileNames.includes(img.fileName)) {
            await removeStoredImage(img, uploadsDir);
        }
    }

    const newUploadedImages = await Promise.all(
        galleryFiles.map(async (file) => {
            const up = await uploadImageBuffer(file.buffer, file.mimetype, "products/gallery");
            return toStoredImage(up);
        })
    );

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
    const files = req.files || {};
    const list = files.bannerImages || [];
    const bannerimages = [];
    for (const v of list) {
        const up = await uploadImageBuffer(v.buffer, v.mimetype, "banners");
        bannerimages.push(toStoredImage(up));
    }

    let data = await bannermodel.insertMany(bannerimages);

    res.send({ success: true, message: "files uploaded successfully", bannerimages });
});

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

    await removeStoredImage(bannerimage, uploadsDir);

    await bannermodel.findByIdAndDelete(bannerid);

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


