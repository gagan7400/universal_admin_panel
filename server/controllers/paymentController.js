const Payment = require("../models/payment");
const Razorpay = require('razorpay');
const Order = require("../models/orderModel");
const { Product } = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const mongoose = require("mongoose");
const crypto = require("crypto");

const createOrder = async (req, res) => {
    try {

        const razorpayInstatance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: req.body.price,
            currency: req.body.currency, receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpayInstatance.orders.create(options);
        console.log(order)
        if (!order) res.status(500).json({ success: false, message: "Some error occured" });
        // res.send(order);
        res.status(200).json({ success: true, message: 'Order Created successfully', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData, // custom order info (shipping, items, user, prices)
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // ✅ Save order in DB
            const newOrder = new Order({
                shippingInfo: orderData.shippingInfo,
                orderItems: orderData.orderItems,
                user: orderData.user,
                paymentInfo: {
                    id: razorpay_payment_id,
                    status: "Paid",
                },
                paidAt: Date.now(),
                itemsPrice: orderData.itemsPrice,
                taxPrice: orderData.taxPrice,
                shippingPrice: orderData.shippingPrice,
                totalPrice: orderData.totalPrice,
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
            });

            await newOrder.save();

            res.json({
                success: true,
                message: "Payment verified & order created successfully",
                order: newOrder,
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
};
const paymentComplete = async (req, res) => {
    const { orderId, amount, paymentMethod, status, paymentId } = req.body;

    try {
        const payment = new Payment({
            userId: req.user._id,
            orderId,
            amount,
            paymentMethod,
            status,
            paymentId,
            paidAt: new Date(),
        });

        await payment.save();

        res.status(200).json({ success: true, message: 'Payment recorded successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Payment failed', error: err.message });
    }
};
let paymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).sort({ paidAt: -1 });
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
};

module.exports = { paymentVerification, paymentComplete, paymentHistory, createOrder }