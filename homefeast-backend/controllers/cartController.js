const Cart = require('../models/Cart');

// 🛡️ SUPER SAFE HELPER: Token se ID nikalne ke saare possible tarike
const getUserId = (req) => {
  const id = req.user._id || req.user.id || req.user.userId;
  if (!id) console.error("🚨 CRITICAL: Token verified but User ID missing in payload!", req.user);
  return id;
};

// 1. Get User's Cart
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ message: "User ID missing in token payload." });

    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.dish',
      select: 'name price image type cook'
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Error fetching cart: " + error.message });
  }
};

// 2. Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ message: "User ID missing in token payload." });

    const { dishId } = req.body;
    if (!dishId) return res.status(400).json({ message: "Dish ID is missing in request body." });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 🟢 FIX: Agar database me item.dish 'null' ho, toh toString() crash na kare!
    const itemIndex = cart.items.findIndex(item => item.dish && item.dish.toString() === dishId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1; 
    } else {
      cart.items.push({ dish: dishId, quantity: 1 });
    }

    await cart.save();
    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Error adding to cart: " + error.message });
  }
};

// 3. Update Item Quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = getUserId(req);
    const targetId = req.body.dishId || req.body.itemId; 
    const { quantity } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if(!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      item => (item.dish && item.dish.toString() === targetId) || (item._id && item._id.toString() === targetId)
    );
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }
    
    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Error updating quantity: " + error.message });
  }
};

// 4. Remove Item from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const targetId = req.params.dishId || req.params.itemId || Object.values(req.params)[0];

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = cart.items.filter(
        item => (item.dish && item.dish.toString() !== targetId) && (item._id && item._id.toString() !== targetId)
      );
      await cart.save();
    }

    cart = await cart.populate('items.dish');
    res.status(200).json(cart);
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ message: "Error removing from cart: " + error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItemQuantity, removeFromCart };