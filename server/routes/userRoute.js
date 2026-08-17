// src/routes/example.js
const express = require("express");
const { registration, verifyOTP, resendOTP, forgotPassword, login, verifyAccount, setNewPassword, deleteUserAccount, getAllUsers, updateUser, countUsers,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/userController");
const { isAuthenticatedAdmin, authorizeRoles, isAuthenticatedUser, validateUserOwnership } = require("../middlewares/auth");
const uploadMemory = require("../middlewares/uploadMemory");
const router = express.Router();

router.post("/registration", uploadMemory.single("image"), registration);
router.post("/login", login);
router.post("/verify-account", verifyAccount)
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);
router.post("/delete-user-account/:id", isAuthenticatedUser, validateUserOwnership, deleteUserAccount);
router.get("/getallusers", isAuthenticatedAdmin, getAllUsers);
router.put("/update/:id", isAuthenticatedUser, validateUserOwnership, uploadMemory.single("image"), updateUser);
router.get("/count-users", isAuthenticatedAdmin, countUsers);

router.get("/:id/addresses", isAuthenticatedUser, validateUserOwnership, getAddresses);
router.post("/:id/add-new-address", isAuthenticatedUser, validateUserOwnership, addAddress);
router.put("/:id/update-address/:addressId", isAuthenticatedUser, validateUserOwnership, updateAddress);
router.delete("/:id/delete-address/:addressId", isAuthenticatedUser, validateUserOwnership, deleteAddress);
router.put("/:id/set-default-address/:addressId", isAuthenticatedUser, validateUserOwnership, setDefaultAddress);

module.exports = router;

// fetch address: done
// create address: done
// delete address : done
// update address: done
// setdefault address: done 