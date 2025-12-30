const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],

    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            fileName: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            _id: false
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    bannerImage: {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            name: {
                type: String,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            _id: false
        },
    ],
    dimensions: {
        width: String, height: String, length: String, _id: false
    },
    weight: String,
    size: String,
    HSN: String,
    gstRate: String,
    discountPercentage: String,
    material: String,
    pricePerLot: [
        { min: String, max: String, price: String, typeofProduct: String, _id: false }
    ],
    shippingPricePerKM: [
        {
            min: String, max: String, shippingPrice: String, packagingFee: String, _id: false
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const bannerimages = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
})
const bannermodel = mongoose.model("bannerimages", bannerimages);
module.exports.bannermodel = bannermodel;
let Product = mongoose.model("products", productSchema);
module.exports.Product = Product;
