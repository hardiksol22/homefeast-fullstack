const CookProfile = require('../models/CookProfile');
const Menu = require('../models/Menu');

// @route   GET /api/cooks
// @desc    Get all approved home cooks (For Customer Dashboard)
exports.getAllCooks = async (req, res) => {
  try {
    // Sirf un cooks ko fetch karein jo admin dwara approved hain
    // .populate() se hume user collection se unka naam bhi mil jayega
    const cooks = await CookProfile.find({ isApproved: true })
      .populate('user', 'name email'); 
      
    res.status(200).json(cooks);
  } catch (error) {
    console.error("Error in getAllCooks:", error);
    res.status(500).json({ message: 'Server Error while fetching cooks' });
  }
};

// @route   GET /api/cooks/:id
// @desc    Get specific cook details and their menu (For Provider Details Page)
exports.getCookDetails = async (req, res) => {
  try {
    const cookUserId = req.params.id;

    // 1. Cook ki profile fetch karein
    const cookProfile = await CookProfile.findOne({ user: cookUserId })
      .populate('user', 'name');

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' });
    }

    // 2. Us cook ka menu fetch karein
    const menu = await Menu.find({ cook: cookUserId });

    // Dono cheezein frontend ko bhej dein
    res.status(200).json({ 
      profile: cookProfile, 
      menu: menu 
    });
  } catch (error) {
    console.error("Error in getCookDetails:", error);
    res.status(500).json({ message: 'Server Error while fetching cook details' });
  }
};