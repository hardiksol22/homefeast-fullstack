const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItemQuantity, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItemQuantity);
router.delete('/remove/:dishId', protect, removeFromCart);

module.exports = router;