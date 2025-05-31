const Product = require("../models/product");
let catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

let createProductController = catchAsyncErrors(async (req, res, next) => {
    let product = await new Product({ ...req.body });
    await product.save();
    res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        data: product
    })
})
// const createProductController = catchAsyncErrors(async (req, res, next) => {
//     const files = req.files; // Array of image files

//     // Optional: Log file names
//     // console.log("Uploaded files:", files.map(f => f.originalname));

//     // Convert files to { fileName, url } format
//     // For now, we simulate the URL using local path or buffer preview
//     const images = files.map((file) => ({
//         fileName: file.originalname,
//         url: `uploads/${file.originalname}`, // You can change this if you upload to S3/Cloudinary
//     }));

//     const {
//         name,
//         description,
//         price,
//         ratings = 0,
//         category,
//         Stock,
//         numOfReviews = 0,
//         weight,
//         size,
//         discountPercentage,
//         material,
//         "dimensions[width]": width,
//         "dimensions[height]": height,
//     } = req.body;

//     const product = new Product({
//         name,
//         description,
//         price,
//         ratings,
//         images,
//         category,
//         Stock,
//         numOfReviews,
//         weight,
//         size,
//         discountPercentage,
//         material,
//         dimensions: {
//             width,
//             height,
//         },
//     });

//     await product.save();

//     res.status(201).json({
//         success: true,
//         message: "Product Created Successfully",
//         data: product,
//     });
// });

let getAllProducts = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.find();
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

let deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
        data: product,
    });
})
let updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    let newproduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
        data: newproduct,
    });
})

module.exports = { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct }