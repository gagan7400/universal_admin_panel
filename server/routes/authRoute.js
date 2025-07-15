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
const { createSubadmin, deleteSubadmin, updateSubadmin, loginSubadmin, getAllSubadmins, getsubadminprofile, logoutSubAdmin } = require("../controllers/subadminController");

// permissions  = view_orders , process_orders , add_products,delete_products ,update_products , products_all
// subadmin route
router.post("/subadmin/new", isAuthenticatedAdmin, createSubadmin);
router.put("/subadmin/:id", isAuthenticatedAdmin, updateSubadmin);
router.get("/subadmins", isAuthenticatedAdmin, getAllSubadmins);
router.delete("/subadmin/:id", isAuthenticatedAdmin, deleteSubadmin);
router.post("/subadmin/login", loginSubadmin);
router.get("/subadmin/profile", isAuthenticatedAdmin, getsubadminprofile);
router.get("/subadmin/logout", logoutSubAdmin);


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logoutAdmin);
router.get("/profile", isAuthenticatedAdmin, getprofile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
