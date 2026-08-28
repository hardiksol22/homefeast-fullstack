const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 🚀 THE FIX: Mongoose ko ab Cook (Provider) ki ID save karni aati hai!
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    default: null
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    default: 'Placed'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);