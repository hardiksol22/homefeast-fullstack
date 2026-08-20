const Menu = require('../models/Menu');

// @route   POST /api/menu
// @desc    Add a new dish to the menu (with image)
exports.addMenuItem = async (req, res) => {
  try {
    const { dishName, price, mealType, planType, isAvailable } = req.body;
    
    // Cloudinary se jo live URL aaya hai, use nikalenge (agar image upload hui hai)
    const imageUrl = req.file ? req.file.path : ''; 

    // Naya menu item banayein
    const newItem = new Menu({
      cook: req.user.userId || req.user.id, // Token se automatically cook ka ID mil jayega
      dishName,
      price,
      mealType,
      planType,
      isAvailable,
      image: imageUrl // <--- IMAGE URL DATABASE MEIN SAVE HOGA
    });

    await newItem.save();
    res.status(201).json({ message: 'Menu item added successfully!', item: newItem });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/menu/my-menu
// @desc    Get all menu items for the logged-in cook
exports.getMyMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ cook: req.user.userId || req.user.id });
    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching my menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/menu/:cookId
// @desc    Get menu items for a specific cook (Public/Customer)
exports.getProviderMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ cook: req.params.cookId });
    res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching provider menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/menu/:id
// @desc    Update an existing dish (Protected: Cook Only)
exports.updateMenuItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const cookId = req.user.userId || req.user.id;
    
    // Pehle check karein ki kya yeh item isi cook ka hai
    let item = await Menu.findOne({ _id: itemId, cook: cookId });
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    // Naya data set karein
    const updateData = { ...req.body };
    
    // Agar update karte waqt nayi image upload ki gayi hai, toh usey bhi update karein
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Data update karein
    item = await Menu.findByIdAndUpdate(itemId, updateData, { new: true });
    res.status(200).json({ message: 'Menu item updated successfully!', item });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   DELETE /api/menu/:id
// @desc    Delete a dish from the menu (Protected: Cook Only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const cookId = req.user.userId || req.user.id;
    
    const item = await Menu.findOneAndDelete({ _id: itemId, cook: cookId });
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully!' });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};