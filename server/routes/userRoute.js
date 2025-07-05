// src/routes/example.js
const express = require("express");
const { registration, verifyOTP, resendOTP, forgotPassword, login, verifyAccount, setNewPassword, deleteUserAccount, getAllUsers, updateUser, countUsers,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/userController");
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
router.put("/update/:id", isAuthenticatedUser, authorizeRoles("user"), upload.single("image"), updateUser);
router.get("/count-users", isAuthenticatedAdmin, authorizeRoles("admin"), countUsers);

router.get("/:id/addresses", isAuthenticatedUser, authorizeRoles("user"), getAddresses);
router.post("/:id/add-new-address", isAuthenticatedUser, authorizeRoles("user"), addAddress);
router.put("/:id/update-address/:addressId", isAuthenticatedUser, authorizeRoles("user"), updateAddress);
router.delete("/:id/delete-address/:addressId", isAuthenticatedUser, authorizeRoles("user"), deleteAddress);
router.put("/:id/set-default-address/:addressId", isAuthenticatedUser, authorizeRoles("user"), setDefaultAddress);

module.exports = router;

// fetch address: done
// create address: done
// delete address : done
// update address: done
// setdefault address: done 