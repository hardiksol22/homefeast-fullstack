const express = require('express');
const router = express.Router();

// 🟢 Controller se saare functions import kar rahe hain (Cook wala bhi add kar diya)
const { 
  createOrder, 
  verifyPayment, 
  getUserOrders,
  cancelAndRefundOrder,
  getProviderOrders // 👈 Naya function import kiya
} = require('../controllers/paymentController');

// 🛒 Route 1: Naya Order Create Karne Ke Liye
router.post('/order', createOrder);

// 🛡️ Route 2: Payment Verify aur Database me Save Karne Ke Liye
router.post('/verify', verifyPayment);

// 📦 Route 3: Customer ke saare orders laane ke Liye
router.get('/orders/:userId', getUserOrders);

// 🛑 Route 4: Order Cancel aur Refund Initiate Karne Ke Liye
router.post('/cancel', cancelAndRefundOrder);

// 👨‍🍳 Route 5: Cook (Provider) ke saare orders laane ke liye (NAYA ROUTE)
router.get('/provider-orders/:providerId', getProviderOrders);

module.exports = router;