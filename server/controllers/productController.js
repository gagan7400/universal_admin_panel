const Product = require("../models/productModel");
let catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path")
const fs = require("fs");
var http = require('http');
var url = require('url');

// const base_url = process.env.NODE_ENV == "production" ? process.env.BASE_URL_LIVE : process.env.BASE_URL;
const base_url = "http://srv918880.hstgr.cloud:4000";


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
        size,
        discountPercentage,
        material,
        dimensions,
    } = req.body;

    if (typeof dimensions === "string") {
        dimensions = JSON.parse(dimensions);
    }

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
        size,
        discountPercentage,
        material,
        dimensions,
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
        message: "Products Find Successfully"
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


module.exports = { updateProduct };


module.exports = { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct }