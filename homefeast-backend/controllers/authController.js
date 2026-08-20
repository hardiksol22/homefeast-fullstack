const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token Generator Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_key_123', {
    expiresIn: '30d',
  });
};

// 🟢 REGISTER LOGIC (Strict Role Based)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered. Please login." });
    }

    // 🟢 CREATE USER WITH ROLE (Frontend se jo role aayega, wahi save hoga)
    const user = await User.create({
      name,
      email,
      password, // Note: You should ideally hash this in the User model using bcrypt
      role: role || 'customer', // Agar role empty hai toh customer banao
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 Role pakka frontend ko waapas bhejna hai
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟢 LOGIN LOGIC
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // In a real app, use bcrypt.compare(password, user.password)
    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 Frontend is role ko padh kar decide karega kahan jana hai
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};