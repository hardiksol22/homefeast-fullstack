const User = require('../models/User'); // Apne User model ka path check kar lein
const Cook = require('../models/Cook'); // Apne Cook model ka path check kar lein
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🟢 GENERATE JWT TOKEN FUNCTION
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token 30 din tak valid rahega
  });
};

// 🟢 REGISTER USER (CUSTOMER OR COOK)
const registerUser = async (req, res) => {
  try {
    // Frontend se aane wala data extract kar rahe hain
    const { name, email, password, role, kitchenName } = req.body;

    // 1. Check if all basic fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // 2. Check if user already exists in Database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Hash the Password for Security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the User Profile
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    // 5. 🌟 THE MAGIC: IF USER IS A COOK, SAVE THEIR KITCHEN
    if (user.role === 'cook') {
      await Cook.create({
        user: user._id, // User ID se link kar diya
        kitchenName: kitchenName || `${name}'s Kitchen`, // Frontend wala naam yahan save hoga
        cuisine: 'Multi-Cuisine', // Default
        rating: '0.0', // Default starting rating
        image: '' // Front-end ka smart engine khud photo laga dega agar yeh khali hoga
      });
    }

    // 6. Send Success Response with Token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// 🟢 LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Compare entered password with hashed password in DB
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Email or Password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};