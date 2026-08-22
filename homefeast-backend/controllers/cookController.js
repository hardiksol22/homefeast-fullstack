const Cook = require('../models/Cook');
const Dish = require('../models/Dish');

// 1. GET ALL KITCHENS (Explore Page ke liye)
const getAllCooks = async (req, res) => {
  try {
    const kitchens = await Cook.find().populate('user', 'name email');
    res.status(200).json(kitchens);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching kitchens" });
  }
};

// 2. ADD A NEW DISH (Crash-Proof Version)
const addDish = async (req, res) => {
  try {
    // 🟢 SMART FALLBACK: Token se ID lein, ya request body se ensure karein taaki 500 error na aaye
    const cookId = req.user?._id || req.body?.cookId; 

    if (!cookId) {
      return res.status(401).json({ message: "Not authorized, cook ID missing!" });
    }

    const { name, price, description, type, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Dish name and price are required!" });
    }

    // Nayi dish DB me safely ban gayi!
    const newDish = await Dish.create({
      cook: cookId, // Dish par Cook ka tag lag gaya
      name,
      price,
      description,
      type: type || 'Veg',
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    });

    res.status(201).json(newDish);
  } catch (error) {
    console.error("Add Dish Error:", error);
    res.status(500).json({ message: "Server error while adding dish: " + error.message });
  }
};

// 3. GET KITCHEN MENU LIST (Customer jab kitchen kholega tab uski saari dishes aayengi)
const getMenu = async (req, res) => {
  try {
    const { cookId } = req.params; // URL se cook ki ID nikal li
    
    // Database me dhoondho wo saari dishes jispar is cookId ka tag hai
    const menuList = await Dish.find({ cook: cookId });
    
    res.status(200).json(menuList);
  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({ message: "Server error while fetching menu" });
  }
};

module.exports = {
  getAllCooks,
  addDish,
  getMenu
};