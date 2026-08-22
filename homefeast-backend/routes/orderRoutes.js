const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Sabhi order routes protected hain
router.post('/', protect, createOrder);                 // Create new order
router.get('/my-orders', protect, getMyOrders);         // Get customer/cook orders
router.get('/provider', protect, getMyOrders);          // 🟢 FIX: Frontend CookDashboard ke liye
router.get('/customer', protect, getMyOrders);          // 🟢 FIX: Frontend Customer Orders page ke liye
router.put('/:id/status', protect, updateOrderStatus);  // Change order status

module.exports = router;