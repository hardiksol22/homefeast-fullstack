const User = require('../models/User');
const Cook = require('../models/Cook'); // Cook profile
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 🟢 REGISTER LOGIC (Dono ko alag-alag table me bhejna)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, kitchenName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 👨‍🍳 AGAR COOK HAI, TOH SIRF COOK TABLE ME JAYEGA
    if (role === 'cook') {
      const cookExists = await Cook.findOne({ email });
      if (cookExists) return res.status(400).json({ message: 'Email already registered as a Cook' });

      const newCook = await Cook.create({
        name,
        email,
        password: hashedPassword,
        role: 'cook',
        kitchenName: kitchenName || `${name}'s Kitchen`,
      });

      return res.status(201).json({
        _id: newCook._id,
        name: newCook.name,
        email: newCook.email,
        role: newCook.role,
        kitchenName: newCook.kitchenName,
        token: generateToken(newCook._id),
      });
    } 
    
    // 🙍‍♂️ AGAR CUSTOMER HAI, TOH SIRF USER TABLE ME JAYEGA
    else {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'Email already registered as a Customer' });

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'customer',
      });

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// 🟢 LOGIN LOGIC (Pehle Customer me dhundo, na mile toh Cook me dhundo)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await User.findOne({ email });
    let isCook = false;

    // Agar customer table me nahi mila, toh pakka Cook hoga
    if (!account) {
      account = await Cook.findOne({ email });
      isCook = true;
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      res.json({
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        ...(isCook && { kitchenName: account.kitchenName }), // Agar cook hai toh kitchen name bhi bhej do
        token: generateToken(account._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Email or Password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};

module.exports = { registerUser, loginUser };