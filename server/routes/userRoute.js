// src/routes/example.js
const express = require("express");
const { registration, verifyOTP, resendOTP, forgotPassword, login, setNewPassword, deleteUserAccount } = require("../controllers/userController");
const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);
router.post("/delete-user-account/:id", deleteUserAccount);


module.exports = router;
