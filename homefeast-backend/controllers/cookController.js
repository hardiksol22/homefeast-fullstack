const Cook = require('../models/Cook');
// const Dish = require('../models/Dish'); // (Agar Dish model banaya hai toh isey un-comment karein)

// 🟢 1. NAYA FUNCTION: GET ALL KITCHENS (Explore Page ke liye)
const getAllCooks = async (req, res) => {
  try {
    const kitchens = await Cook.find().populate('user', 'name email');
    res.status(200).json(kitchens);
  } catch (error) {
    console.error("Error fetching kitchens:", error);
    res.status(500).json({ message: "Server Error fetching kitchens" });
  }
};

// 🟡 2. AAPKE PURANE FUNCTIONS YAHAN RAKHEIN
// (Agar aapke paas menu ya dish add karne ke functions yahan the, toh unhe waise hi rehne dein)
/*
const addDish = async (req, res) => {
   // Aapka purana dish add karne ka code
};

const getMenu = async (req, res) => {
   // Aapka purana menu fetch karne ka code
};
*/

// 🔴 3. SABSE ZAROORI STEP: EXPORT EVERYTHING
module.exports = {
  getAllCooks,
  // Agar upar addDish aur getMenu hain, toh unka naam bhi yahan likhna zaroori hai:
  // addDish,
  // getMenu
};