const Order = require("../models/orderModel");
const { Product } = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const mongoose = require("mongoose");

exports.calculatePrice = async (req, res) => {
    try {
        const { productId, quantity, destination, packagingType } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // =====================
        // 1️⃣ LOT PRICE
        // =====================
        let unitPrice = product.price;

        if (product.pricePerLot?.length) {
            const lot = product.pricePerLot.find(
                p => quantity >= p.minQty && quantity <= p.maxQty
            );
            if (lot) unitPrice = lot.pricePerUnit;
        }

        const productCost = unitPrice * quantity;

        // =====================
        // 2️⃣ SHIPPING COST
        // =====================
        const haversineDistance = (lat1, lon1, lat2, lon2) => {
            lat1 = Number(lat1);
            lon1 = Number(lon1);
            lat2 = Number(lat2);
            lon2 = Number(lon2);
            const toRad = (value) => (value * Math.PI) / 180;

            const R = 6371; // Earth radius in KM

            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // KM
        };
        const warehouseLat = Number(process.env.WAREHOUSE_LATITUDE) || 28.6139;
        const warehouseLng = Number(process.env.WAREHOUSE_LONGITUDE) || 75.8;

        const destLat = Number(destination.latitude);
        const destLng = Number(destination.longitude);

        if (
            isNaN(destLat) || isNaN(destLng) ||
            destLat < -90 || destLat > 90 ||
            destLng < -180 || destLng > 180
        ) {
            return res.status(400).json({ message: "Invalid destination coordinates" });
        }

        const distanceKM = haversineDistance(
            warehouseLat,
            warehouseLng,
            destLat,
            destLng
        );

        let shippingCost = 0;

        if (product.shippingPricePerKM?.length) {
            const slab = product.shippingPricePerKM.find(
                s => distanceKM >= s.minKM && distanceKM <= s.maxKM
            );

            if (!slab) {
                return res.status(400).json({
                    message: "Shipping not available for this distance"
                });
            }

            shippingCost = slab.pricePerKM * distanceKM;
        }

        // =====================
        // 3️⃣ PACKAGING COST
        // =====================
        let packagingCost = 0;
        let packagesUsed = 0;

        if (packagingType && product.packagingOptions?.length) {

            const pkg = product.packagingOptions.find(
                p => p.type === packagingType
            );

            if (!pkg) {
                return res.status(400).json({
                    message: "Invalid packaging type"
                });
            }

            const totalWeight = product.weight * quantity;

            // By weight
            const packagesByWeight = Math.ceil(
                totalWeight / pkg.maxWeightPerPackage
            );

            // By item (optional)
            const packagesByItem = pkg.maxItemsPerPackage
                ? Math.ceil(quantity / pkg.maxItemsPerPackage)
                : 0;

            packagesUsed = packagesByItem
                ? Math.max(packagesByWeight, packagesByItem)
                : packagesByWeight;

            packagingCost = packagesUsed * pkg.feePerPackage;
        }

        // =====================
        // 4️⃣ FINAL PRICE
        // =====================
        const totalPrice = productCost + shippingCost + packagingCost;

        res.status(200).json({
            success: true,
            breakdown: {
                unitPrice,
                quantity,
                productCost,
                distanceKM,
                shippingCost,
                packaging: {
                    type: packagingType,
                    packagesUsed,
                    packagingCost
                }
            },
            totalPrice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



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
    const orders = await Order.find({ "user.id": req.user._id });

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("❌ Invalid product ID");
        return;
    }

    const product = await Product.findById(id);
    if (!product) {
        console.log("❌ Product not found");
        return;
    }

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


