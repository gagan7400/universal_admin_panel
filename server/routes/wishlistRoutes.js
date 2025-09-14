const express = require("express");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { isAuthenticatedUser } = require("../middlewares/auth"); // use your auth middleware
const router = express.Router();

// Add product to wishlist
router.post("/:productId", isAuthenticatedUser, addToWishlist);

// Get all wishlist items
router.get("/", isAuthenticatedUser, getWishlist);

// Remove product from wishlist
router.delete("/:productId", isAuthenticatedUser, removeFromWishlist);

module.exports = router;
