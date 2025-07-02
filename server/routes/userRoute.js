// src/routes/example.js
const express = require("express");
const { registration, verifyOTP, resendOTP, forgotPassword, login, verifyAccount, setNewPassword, deleteUserAccount, getAllUsers, updateUser, countUsers } = require("../controllers/userController");
const { isAuthenticatedAdmin, authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/registration", upload.single("image"), registration);
router.post("/login", login);
router.post("/verify-account", verifyAccount)
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);
router.post("/delete-user-account/:id", deleteUserAccount);
router.get("/getallusers", isAuthenticatedAdmin, authorizeRoles("admin"), getAllUsers);
router.put("/update", isAuthenticatedUser, authorizeRoles("user"), updateUser);
router.get("/count-users", isAuthenticatedAdmin, authorizeRoles("admin"), countUsers);


module.exports = router;
