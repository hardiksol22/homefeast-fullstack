const Cart = require('../models/Cart');

// 🛡️ HELPER FUNCTION: To safely extract user ID whether it's 'id' or '_id'
const getUserId = (req) => {
  return req.user._id || req.user.id;
};

// 1. Get User's Cart
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.dish',
      select: 'name price image type cook' // Dish ki details
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart: " + error.message });
  }
};

// 2. Add Item to Cart (Ya quantity badhayein agar pehle se hai)
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { dishId } = req.body;
    
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] }); // Error yahan aata tha, ab fix ho gaya!
    }

    const itemIndex = cart.items.findIndex(item => item.dish.toString() === dishId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1; // Pehle se hai toh quantity +1
    } else {
      cart.items.push({ dish: dishId, quantity: 1 }); // Naya item
    }

    await cart.save();
    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart: " + error.message });
  }
};

// 3. Update Item Quantity (+ / -)
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    // 🟢 FIX: Frontend se kabhi itemId aata hai aur kabhi dishId, hum dono handle kar lenge
    const targetId = req.body.dishId || req.body.itemId; 
    const { quantity } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if(!cart) return res.status(404).json({ message: "Cart not found" });

    // Match by dishId OR the subdocument _id
    const itemIndex = cart.items.findIndex(
      item => item.dish.toString() === targetId || item._id.toString() === targetId
    );
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }
    
    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity: " + error.message });
  }
};

// 4. Remove Item from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    // 🟢 FIX: Param se aane wali koi bhi ID nikal lega automatically
    const targetId = req.params.dishId || req.params.itemId || Object.values(req.params)[0];

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Remove matching dish ID OR matching subdocument ID
      cart.items = cart.items.filter(
        item => item.dish.toString() !== targetId && item._id.toString() !== targetId
      );
      await cart.save();
    }

    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart: " + error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItemQuantity, removeFromCart };