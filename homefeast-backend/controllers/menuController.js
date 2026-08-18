const Menu = require('../models/Menu');

// @route   POST /api/menu
// @desc    Add a new dish to the menu (Protected: Cook Only)
exports.addMenuItem = async (req, res) => {
  try {
    const { dishName, price, mealType, planType, isAvailable } = req.body;
    
    // Naya menu item banayein
    const newItem = new Menu({
      cook: req.user.userId, // Token se automatically cook ka ID mil jayega
      dishName,
      price,
      mealType,
      planType,
      isAvailable
    });

    await newItem.save();
    res.status(201).json({ message: 'Menu item added successfully!', item: newItem });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/menu/:id
// @desc    Update an existing dish (Protected: Cook Only)
exports.updateMenuItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Pehle check karein ki kya yeh item is hi cook ka hai
    let item = await Menu.findOne({ _id: itemId, cook: req.user.userId });
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    // Data update karein
    item = await Menu.findByIdAndUpdate(itemId, req.body, { new: true });
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
    
    const item = await Menu.findOneAndDelete({ _id: itemId, cook: req.user.userId });
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found or unauthorized' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully!' });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};