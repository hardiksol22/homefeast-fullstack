const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // 🟢 YAHAN FIX KIYA HAI: Role field add kar di gayi hai
  role: {
    type: String,
    enum: ['customer', 'cook', 'admin'],
    default: 'customer',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;