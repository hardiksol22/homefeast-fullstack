const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  cook: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  dishName: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  mealType: { 
    type: String, 
    enum: ['Pure Veg', 'Non-Veg', 'Vegan'], 
    required: true 
  },
  planType: { 
    type: String, 
    enum: ['Daily', 'Weekly', 'Monthly'], 
    default: 'Daily' 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);