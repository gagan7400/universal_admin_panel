const express = require("express");
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    logoutAdmin,
    getprofile
} = require("../controllers/adminController.js");
let router = express.Router();
const { isAuthenticatedAdmin, authorizeRoles } = require("../middlewares/auth.js");
const { createSubadmin, deleteSubadmin, } = require("../controllers/subadminController");

 
// subadmin route
router.post("/subadmin", isAuthenticatedAdmin, authorizeRoles("admin"), createSubadmin);
router.delete("/subadmin/:id", isAuthenticatedAdmin, authorizeRoles("admin"), deleteSubadmin);


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logoutAdmin);
router.get("/profile", isAuthenticatedAdmin, authorizeRoles("admin"), getprofile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
