const express = require("express");
const { register, login, forgotPassword, resetPassword, logoutAdmin, getprofile } = require("../controllers/adminController.js");
let router = express.Router();
const { isAuthenticatedAdmin, authorizeRoles } = require("../middlewares/auth.js");
const { createSubadmin, deleteSubadmin, updateSubadmin, loginSubadmin, getAllSubadmins } = require("../controllers/subadminController");


router.post("/subadmin/new", isAuthenticatedAdmin, authorizeRoles("admin"), createSubadmin);
router.put("/subadmin/:id", isAuthenticatedAdmin, authorizeRoles("admin"), updateSubadmin);
router.get("/subadmins", isAuthenticatedAdmin, authorizeRoles("admin"), getAllSubadmins);
router.delete("/subadmin/:id", isAuthenticatedAdmin, authorizeRoles("admin"), deleteSubadmin);
router.post("/subadmin/login", loginSubadmin);


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logoutAdmin);
router.get("/profile", isAuthenticatedAdmin, getprofile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
