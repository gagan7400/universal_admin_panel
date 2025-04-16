// src/routes/example.js
const express = require("express");
const { registration, verifyOTP, resendOTP, forgotPassword, login } = require("../controllers/userController");
const router = express.Router();

router.post("/registration" , registration);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);


module.exports = router;
