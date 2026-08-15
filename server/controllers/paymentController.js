const Payment = require("../models/payment");
const Razorpay = require('razorpay');
const Order = require("../models/orderModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const { sendEmail } = require("../utils/common_functions");
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
    let adminhtml = `<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
  <title>New Order</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; margin:20px; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td style="background:#1a73e8; color:#ffffff; padding:20px; text-align:center;">
          <h2 style="margin:0;">🛒 New Order Received</h2>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:20px; color:#333;">
          <p>Hello Admin,</p>
          <p>A new order has been placed on your platform.</p>

          <h3 style="margin-top:20px;">📦 Order Details</h3>
          <p>
            <strong>Order ID:</strong> ${newOrder._id}<br>
            <strong>Customer:</strong> ${orderData.user.name}<br>
            <strong>Email:</strong> ${orderData.user.email}<br>
            <strong>Total Amount:</strong> ₹${orderData.totalPrice}<br>
            <strong>Payment:</strong> ${orderData.paymentInfo.status}<br>
            <strong>Date:</strong> ${newOrder.paidAt.toLocaleDateString()} ${newOrder.paidAt.toLocaleTimeString()}
          </p>

          <h3>🛍️ Items</h3>
          <p>${orderData.orderItems.map(item => `<p>${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>`).join("")}</p>

          <h3>📍 Shipping Address</h3>
          <p>${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} - ${orderData.shippingInfo.postalCode}</p>

          <div style="text-align:center; margin-top:30px;">
            <a href="{{adminDashboardLink}}" 
               style="background:#1a73e8; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
              View Order
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#777;">
          © {{year}} Your Company. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>

  </table>
</body>
</html>
`
    let Userhtml = `<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; margin:20px; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">


      <!-- Header -->
      <tr>
        <td style="background:#28a745; color:#ffffff; padding:20px; text-align:center;">
          <h2 style="margin:0;">✅ Order Confirmed</h2>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:20px; color:#333;">
          <p>Hello ${req.user.firstName + " " + req.user.lastName},</p>

          <p>Thank you for your purchase! 🎉 Your order has been successfully placed.</p>

          <h3 style="margin-top:20px;">📦 Order Summary</h3>
          <p>
            <strong>Order ID:</strong> ${newOrder._id}<br>
            <strong>Total Amount:</strong> ₹${orderData.totalPrice}<br>
            <strong>Date:</strong> ${newOrder.paidAt.toLocaleDateString()} ${newOrder.paidAt.toLocaleTimeString()}
          </p>

          <h3>🛍️ Items</h3>
          <p>${orderData.orderItems.map(item => `<p>${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>`).join("")}</p>

          <h3>📍 Delivery Address</h3>
          <p>${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} - ${orderData.shippingInfo.postalCode}</p>

          <p style="margin-top:20px;">
            🚚 We will notify you once your order is shipped.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#777;">
          Need help? Contact support anytime.<br>
          © ${new Date().getFullYear()} Universal Ureca. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>
  </table>
</body>
</html>

        `
    await sendEmail(process.env.EMAIL_USER, "New Order Received - Action Required", adminhtml)
    await sendEmail(req.user.email, "Order Confirmation - " + orderFresh._id, Userhtml)
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