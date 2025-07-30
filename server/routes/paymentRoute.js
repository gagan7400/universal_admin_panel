const { paymentComplete, paymentHistory } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = require('express').Router();


router.post("/complete", isAuthenticatedUser, paymentComplete)
router.get("/history", isAuthenticatedUser, paymentHistory)
module.exports = router;
// payment-completion
// 2. payment-history