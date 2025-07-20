const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const mongoose = require("mongoose");


// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    // 1. 🔍 Check stock availability for each product
    for (let item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${item.product} not found`,
            });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`,
            });
        }
    }

    // 2. 🛒 If all items are valid, create the order
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: Number(itemsPrice) + Number(taxPrice) + Number(shippingPrice),
        paidAt: Date.now(),
        user: {
            id: req.user._id,
            name: req.user.firstName + " " + req.user.lastName,
            email: req.user.email,
            phone: req.user.phone,
            image: req.user.image,
        }
    });

    // 3. 🔻 Reduce stock for each product
    for (let item of orderItems) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save({ validateBeforeSave: false });
    }

    res.status(200).json({
        success: true,
        message: "Order placed successfully",
        data: order,
    });
});


// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        data: orders,
    });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        data: orders,
    });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.orderStatus === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Order Updated Successfully",
        data: order
    });
});

async function updateStock(id, quantity) {
    console.log("Updating stock for:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("❌ Invalid product ID");
        return;
    }

    const product = await Product.findById(id);
    if (!product) {
        console.log("❌ Product not found");
        return;
    }

    console.log("✅ Product found:", product.name);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}
// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await Order.findByIdAndDelete(order._id)

    res.status(200).json({
        success: true,
        message: "order Deleted Successully"
    });
});

// delete Order -- Admin
exports.totalOrders = catchAsyncErrors(async (req, res, next) => {
    const count = await Order.countDocuments();

    res.status(200).json({
        success: true,
        message: "count fetch successfully",
        data: count
    });
});


