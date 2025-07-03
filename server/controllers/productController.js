const Product = require("../models/productModel");
let catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path")
const fs = require("fs");


const createProductController = catchAsyncErrors(async (req, res, next) => {
    const files = req.files; // Array of image files
    const images = files.map((file) => ({ fileName: file.filename, url: `uploads/${file.filename}` }));
    let { name, description, price, ratings = 0, category, Stock, numOfReviews = 0, weight, size, discountPercentage, material, dimensions } = req.body;

    if (typeof (dimensions) == "string") {
        dimensions = JSON.parse(dimensions)
    }
    let newProduct = { name, description, price, ratings, images, category, Stock, numOfReviews, weight, size, discountPercentage, material, dimensions }
    const product = new Product(newProduct);

    await product.save();

    res.status(201).json({
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

// let deleteProduct = catchAsyncErrors(async (req, res, next) => {
//     let product = await Product.findById(req.params.id);
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404));
//     }
//     await Product.findByIdAndDelete(req.params.id)
//     res.status(200).json({
//         success: true,
//         message: "Product Deleted Successfully",
//         data: product,
//     });
// })
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // 🧹 Delete associated images from disk
    if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
            const filePath = path.join(__dirname, "../", img.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    }

    // 🗑️ Delete the product from DB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
        data: product,
    });
});


// let updateProduct = catchAsyncErrors(async (req, res, next) => {
//     let product = await Product.findById(req.params.id);
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404));
//     }
//     let newproduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     res.status(200).json({
//         success: true,
//         message: "Product Updated Successfully",
//         data: newproduct,
//     });
// })
const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Parse dimensions if provided
    if (req.body.dimensions) {
        try {
            req.body.dimensions = JSON.parse(req.body.dimensions);
        } catch (err) {
            return next(new ErrorHandler("Invalid dimensions format", 400));
        }
    }

    // Handle new image uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
        newImages = req.files.map((file) => ({
            fileName: file.originalname,
            url: `uploads/${file.filename}`,
        }));

        // Optional: delete old images from disk
        product.images.forEach((img) => {
            const imgPath = path.join(__dirname, "../", img.url);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        });

        req.body.images = newImages;
    } else {
        // Keep existing images if no new images are uploaded
        req.body.images = product.images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
        data: updatedProduct,
    });
});


module.exports = { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct }