const Cart = require('../models/Cart');

// 1. Get User's Cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.dish',
      select: 'name price image type cook' // Dish ki details
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart: " + error.message });
  }
};

// 2. Add Item to Cart (Ya quantity badhayein agar pehle se hai)
const addToCart = async (req, res) => {
  try {
    const { dishId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
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
    const { dishId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    const itemIndex = cart.items.findIndex(item => item.dish.toString() === dishId);
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
    const { dishId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter(item => item.dish.toString() !== dishId);
      await cart.save();
    }

    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart: " + error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItemQuantity, removeFromCart };