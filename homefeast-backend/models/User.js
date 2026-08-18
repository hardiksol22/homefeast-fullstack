const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['customer', 'cook', 'admin'], 
    default: 'customer' 
  }
}, { timestamps: true }); // timestamps true karne se createdAt aur updatedAt automatically save honge

module.exports = mongoose.model('User', userSchema);