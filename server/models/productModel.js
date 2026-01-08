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
        width: Number, height: Number, length: Number, _id: false
    },
    weight: { type: Number },
    HSN: String,
    gstRate: { type: Number },
    discountPercentage: { type: Number },
    material: String,
    pricePerLot: [
        {
            minQty: { type: Number, required: true },
            maxQty: { type: Number, required: true },
            pricePerUnit: { type: Number, required: true },
            _id: false
        }
    ],

    packagingOptions: [
        {
            type: { type: String, required: true }, // Box, Bag, Crate
            maxWeight: { type: Number, required: true },
            fee: { type: Number, required: true },
            _id: false
        }
    ],

    shippingPricePerKM: [
        {
            minKM: { type: Number, required: true },
            maxKM: { type: Number, required: true },
            pricePerKM: { type: Number, required: true },
            _id: false
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
