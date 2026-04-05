const Payment = require("../models/payment");
const Razorpay = require('razorpay');
const Order = require("../models/orderModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const razorpayInstatance = new Razorpay({
    key_id: process.env.RAZORPAY_LIVE_KEY_ID,
    key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
});

const createOrder = catchAsyncErrors(async (req, res) => {
    // ✅ crypto-based unique receipt id
    const receiptId = `rcpt_${crypto.randomBytes(8).toString("hex")}`;

    const options = {
        amount: Math.round(Number(req.body.price) * 100),
        currency: req.body.currency,
        receipt: receiptId,
    };

    const order = await razorpayInstatance.orders.create(options);

    if (!order) {
        throw new ErrorHandler("Order creation failed", 500);
    }
    // res.send(order);
    res.status(200).json({ success: true, message: 'Order Created successfully', data: order });

})

const paymentVerification = catchAsyncErrors(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData, // custom order info (shipping, items, user, prices)
    } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_LIVE_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // ✅ Save order in DB
        const newOrder = new Order({
            shippingInfo: orderData.shippingInfo,
            orderItems: orderData.orderItems,
            user: {
                id: req.user._id,
                name: req.user.firstName + " " + req.user.lastName,
                email: req.user.email,
                phone: req.user.phone,
                image: req.user.image
            },
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

        try {
            const { createAndSaveInvoiceForOrder } = require("../invoice/invoiceService");
            await createAndSaveInvoiceForOrder(newOrder);
        } catch (invErr) {
            console.error("Invoice generation failed (order still created):", invErr.message);
        }

        await Payment.create({
            userId: req.user._id,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: orderData.totalPrice,
            paymentMethod: "Razorpay",
            status: "Success",
            paidAt: Date.now(),
        });

        const orderFresh = await Order.findById(newOrder._id);

        res.json({
            success: true,
            message: "Payment verified & order created successfully",
            order: orderFresh || newOrder,
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }

})

let paymentHistory = catchAsyncErrors(async (req, res) => {
    const payments = await Payment.find({ userId: req.user._id }).sort({ paidAt: -1 });
    res.status(200).json({ success: true, data: payments });
});

const getRazorpayKey = catchAsyncErrors(async (req, res) => {
    const { type } = req.params;

    const keys = {
        test: process.env.RAZORPAY_TEST_KEY_ID,
        live: process.env.RAZORPAY_LIVE_KEY_ID
    };

    const key = keys[type];

    if (!key) {
        return res.status(400).json({
            success: false,
            message: "Invalid type"
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            key_id: key
        }
    });
});
module.exports = { paymentVerification, paymentHistory, createOrder, getRazorpayKey }