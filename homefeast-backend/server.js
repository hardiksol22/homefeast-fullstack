const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 🚀 Express App Initialize karna
const app = express();

// 🛡️ Middlewares
app.use(cors({
  origin: '*', // Sabhi origins allow karne ke liye (ya apne frontend URL ke sath)
  credentials: true
}));
app.use(express.json()); // JSON data read karne ke liye

// 🌍 Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
  });

// 🛣️ API Routes (🟢 ALL ROUTES FULLY UNCOMMENTED & CONNECTED)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cooks', require('./routes/cookRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// 🏠 Basic Test Route
app.get('/', (req, res) => {
  res.send("HomeFeast Backend is Live and Running! 🚀");
});

// 🎯 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});