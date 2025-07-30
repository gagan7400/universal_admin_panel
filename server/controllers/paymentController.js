const Payment = require("../models/payment");


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

module.exports = { paymentComplete, paymentHistory }