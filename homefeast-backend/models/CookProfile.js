const mongoose = require('mongoose');

const cookProfileSchema = new mongoose.Schema({
  // Yeh is profile ko main User account se link karega
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  kitchenName: { 
    type: String, 
    required: true 
  },
  cuisine: { 
    type: String 
  },
  location: { 
    type: String 
  },
  fssaiStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },
  isApproved: { 
    type: Boolean, 
    default: false // Admin approval ke baad hi cook platform par dikhega
  }
}, { timestamps: true });

module.exports = mongoose.model('CookProfile', cookProfileSchema);