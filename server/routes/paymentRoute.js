const { paymentComplete, paymentHistory, createOrder, paymentVerification } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/get-razorpay-key', (req, res) => {
    res.send({ key: process.env.RAZORPAY_KEY_ID });
});
router.post("/create-order", isAuthenticatedUser, createOrder)
router.post("/verify-payment", isAuthenticatedUser, paymentVerification)
router.post("/complete", isAuthenticatedUser, paymentComplete)
router.get("/history", isAuthenticatedUser, paymentHistory)
module.exports = router;
// payment-completion
// 2. payment-history