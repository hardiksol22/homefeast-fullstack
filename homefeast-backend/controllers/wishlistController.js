const Wishlist = require('../models/Wishlist');

// 1. Get User's Wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate('dish');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist: " + error.message });
  }
};

// 2. Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { dishId } = req.body;
    const existing = await Wishlist.findOne({ user: req.user._id, dish: dishId });
    
    if (existing) {
      return res.status(400).json({ message: "Dish already in wishlist!" });
    }

    const newItem = await Wishlist.create({ user: req.user._id, dish: dishId });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist: " + error.message });
  }
};

// 3. Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { dishId } = req.params;
    await Wishlist.findOneAndDelete({ user: req.user._id, dish: dishId });
    res.status(200).json({ message: "Removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist: " + error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };