const Cook = require('../models/Cook');
const Dish = require('../models/Dish');

// 1. GET ALL KITCHENS (Fixed: No populate needed since fields are directly in Cook model)
const getAllCooks = async (req, res) => {
  try {
    const kitchens = await Cook.find(); // Direct fetch, as fields like name & email are in Cook schema
    res.status(200).json(kitchens);
  } catch (error) {
    console.error("Get All Cooks Error:", error);
    res.status(500).json({ message: "Server Error fetching kitchens: " + error.message });
  }
};

// 2. ADD A NEW DISH (Crash-Proof Version)
const addDish = async (req, res) => {
  try {
    const cookId = req.user?._id || req.body?.cookId; 

    if (!cookId) {
      return res.status(401).json({ message: "Not authorized, cook ID missing!" });
    }

    const { name, price, description, type, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Dish name and price are required!" });
    }

    const newDish = await Dish.create({
      cook: cookId, 
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

// 3. GET KITCHEN MENU LIST
const getMenu = async (req, res) => {
  try {
    const { cookId } = req.params;
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