const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// ✅ Sahi Export (Yahan sirf database model jayega)
module.exports = mongoose.model('Order', orderSchema);