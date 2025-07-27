const { paymentComplete } = require('../controllers/paymentController');

const router = require('express').Router();
 

router.post("/complete" ,paymentComplete)
module.exports = router ;