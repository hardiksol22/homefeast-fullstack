const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kitchenName: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    default: 'Multi-Cuisine'
  },
  rating: {
    type: String,
    default: '4.8'
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);