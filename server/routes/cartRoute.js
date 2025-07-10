const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, updateCart } = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middlewares/auth');
 
router.post('/add', isAuthenticatedUser, addToCart);
router.get('/', isAuthenticatedUser, getCart);
router.delete('/:productId', isAuthenticatedUser, removeFromCart);
router.put('/:productId', isAuthenticatedUser, updateCart);

module.exports = router;
