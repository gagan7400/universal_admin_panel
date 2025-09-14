const User = require("../models/usermodel");
const { Product } = require("../models/productModel");
// ✅ Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        console.log("ss")
        const userId = req.user.id; // comes from your auth middleware
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const user = await User.findById(userId);

        // Avoid duplicates
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ success: false, message: "Already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({ success: true, wishlist: user.wishlist, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// ✅ Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== req.params.productId
        );
        await user.save();

        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
