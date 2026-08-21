const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
  // Ab User ki ID link karne ki zaroorat nahi hai, Cook khud me ek user hai
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'cook' },
  
  // Kitchen Details
  kitchenName: { type: String, required: true, trim: true },
  cuisine: { type: String, default: 'Multi-Cuisine' },
  rating: { type: String, default: '4.8' },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);