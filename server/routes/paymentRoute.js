const { paymentHistory, createOrder, paymentVerification, getRazorpayKey } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/get-razorpay-key', getRazorpayKey);
router.post("/create-order", isAuthenticatedUser, createOrder)
router.post("/verify-payment", isAuthenticatedUser, paymentVerification)
router.get("/history", isAuthenticatedUser, paymentHistory)
module.exports = router;
