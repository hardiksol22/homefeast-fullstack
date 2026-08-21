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

// 2. ADD A NEW DISH (Cook Dashboard se hoga)
const addDish = async (req, res) => {
  try {
    // req.user._id login token se aayegi (Taki pata chale dish kisne add ki)
    const cookId = req.user._id; 
    const { name, price, description, type, image } = req.body;

    // Nayi dish DB me ban gayi!
    const newDish = await Dish.create({
      cook: cookId, // Dish par Cook ka tag lag gaya
      name,
      price,
      description,
      type,
      image
    });

    res.status(201).json(newDish);
  } catch (error) {
    console.error("Add Dish Error:", error);
    res.status(500).json({ message: "Server error while adding dish" });
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