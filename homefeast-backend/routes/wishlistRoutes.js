const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:dishId', protect, removeFromWishlist);

module.exports = router;