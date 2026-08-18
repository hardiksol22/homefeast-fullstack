const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Sabhi order routes protected hone chahiye (Bina login kiye order nahi ho sakta)
router.post('/', protect, createOrder);                 // Create new order
router.get('/my-orders', protect, getMyOrders);         // Get customer/cook orders
router.put('/:id/status', protect, updateOrderStatus);  // Change order status

module.exports = router;