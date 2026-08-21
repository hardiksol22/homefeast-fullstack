const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  cook: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cook', // 🟢 PEHLE YAHAN 'User' THA, AB ISEY 'Cook' KAR DIYA HAI
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  type: { type: String, enum: ['Veg', 'Non-Veg', 'Egg'], default: 'Veg' },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);