const express = require("express");
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    logoutAdmin,
    getprofile
} = require("../controllers/adminController.js");
const { isAuthenticatedAdmin, authorizeRoles } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logoutAdmin);
router.get("/profile", isAuthenticatedAdmin, authorizeRoles("admin"), getprofile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
