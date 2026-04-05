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
const uploadMemory = require("../middlewares/uploadMemory");
const router = express.Router();

router.post("/registration", uploadMemory.single("image"), registration);
router.post("/login", login);
router.post("/verify-account", verifyAccount)
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);
router.post("/delete-user-account/:id", deleteUserAccount);
router.get("/getallusers", isAuthenticatedAdmin, getAllUsers);
router.put("/update/:id", isAuthenticatedUser, authorizeRoles("user"), uploadMemory.single("image"), updateUser);
router.get("/count-users", isAuthenticatedAdmin, countUsers);

router.get("/:id/addresses",getAddresses);
router.post("/:id/add-new-address",addAddress);
router.put("/:id/update-address/:addressId", updateAddress);
router.delete("/:id/delete-address/:addressId",  deleteAddress);
router.put("/:id/set-default-address/:addressId", setDefaultAddress);

module.exports = router;

// fetch address: done
// create address: done
// delete address : done
// update address: done
// setdefault address: done 