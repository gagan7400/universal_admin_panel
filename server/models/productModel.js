const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
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
        width: String, height: String, _id: false
    },
    weight: String,
    size: String,
    discountPercentage: String,
    material: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("products", productSchema);
