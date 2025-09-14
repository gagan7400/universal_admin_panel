const Cart = require('../models/cart');
const { Product } = require('../models/productModel');

// Add to cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });


        // 🔥 Add this stock check:
        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Only ${product.stock} item(s) in stock`,
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        res.status(200).json({ success: true, message: "Item Add To Cart Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        res.status(200).json({ success: true, message: "Carts Get Successfully", data: cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove Item
const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ success: true, message: "Item Removed Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update item quantity
let updateCart = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        const product = await Product.findById(productId);

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        if (itemIndex > -1) {
            const totalQuantity = cart.items[itemIndex].quantity + quantity;
            if (totalQuantity > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} item(s) in stock`,
                });
            }
            cart.items[itemIndex].quantity = totalQuantity;
        }
        cart.items[itemIndex].quantity = quantity;

        await cart.save();

        res.status(200).json({ message: 'Quantity updated', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addToCart, getCart, removeFromCart, updateCart }