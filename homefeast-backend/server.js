const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data parse karne ke liye

// Routes
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/cooks', require('./routes/cookRoutes')); 
app.use('/api/menu', require('./routes/menuRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes')); // <--- YEH NAYI ADMIN LINE HAI

// Basic Test Route
app.get('/', (req, res) => {
  res.send('HomeFeast API is running successfully! 🚀');
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Database');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });