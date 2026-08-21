const Cook = require('../models/Cook');

// 🟢 GET ALL KITCHENS (Explore Page ke liye)
const getAllCooks = async (req, res) => {
  try {
    // Database se saare kitchens nikal rahe hain aur 'user' ka naam bhi sath laa rahe hain
    const kitchens = await Cook.find().populate('user', 'name email');
    
    res.status(200).json(kitchens);
  } catch (error) {
    console.error("Error fetching kitchens:", error);
    res.status(500).json({ message: "Server Error fetching kitchens" });
  }
};

module.exports = {
  getAllCooks
};