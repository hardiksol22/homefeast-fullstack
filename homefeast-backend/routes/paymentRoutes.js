const express = require('express');
const router = express.Router();

// 🟢 Controller se teeno functions import kar rahe hain
const { 
  createOrder, 
  verifyPayment, 
  getUserOrders 
} = require('../controllers/paymentController');

// 🛒 Route 1: Naya Order Create Karne Ke Liye (Checkout ke time)
router.post('/order', createOrder);

// 🛡️ Route 2: Payment Verify aur Database me Save Karne Ke Liye (Payment success hone par)
router.post('/verify', verifyPayment);

// 📦 Route 3: Customer ke saare orders laane ke Liye ("My Orders" page ke liye)
router.get('/orders/:userId', getUserOrders);

module.exports = router;