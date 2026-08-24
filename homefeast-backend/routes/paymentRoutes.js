const express = require('express');
const router = express.Router();

// 🟢 Controller se functions import kar rahe hain
const { 
  createOrder, 
  verifyPayment, 
  getUserOrders 
} = require('../controllers/paymentController');

// 🛒 Route 1: Naya Order Create Karne Ke Liye
router.post('/order', createOrder);

// 🛡️ Route 2: Payment Verify aur Database me Save Karne Ke Liye
router.post('/verify', verifyPayment);

// 📦 Route 3: Customer ke saare orders laane ke Liye
router.get('/orders/:userId', getUserOrders);

module.exports = router;