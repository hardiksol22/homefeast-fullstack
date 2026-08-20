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
    default: 'Pure Veg'
  },
  planType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  image: { 
    type: String // <--- YEH NAYI LINE ADD KI HAI (Cloudinary URL save karne ke liye)
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);