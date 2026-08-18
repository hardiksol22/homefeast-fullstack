const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new subscription/order (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { cookId, plan, totalAmount, deliveryAddress } = req.body;
    
    const newOrder = new Order({
      customer: req.user.userId, // JWT Token se customer ID milega
      cook: cookId,
      plan,
      totalAmount,
      deliveryAddress
    });

    await newOrder.save();
    res.status(201).json({ message: 'Subscription created successfully!', order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Server Error while creating order' });
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get orders for logged-in user (Customer or Cook)
exports.getMyOrders = async (req, res) => {
  try {
    let orders;
    
    // Agar user Customer hai, toh uski kharidi hui subscriptions dikhao
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user.userId })
        .populate('cook', 'name') // Cook ka naam fetch karne ke liye
        .sort({ createdAt: -1 });
    } 
    // Agar user Cook hai, toh usko aaye hue customers ke orders dikhao
    else if (req.user.role === 'cook') {
      orders = await Order.find({ cook: req.user.userId })
        .populate('customer', 'name email') // Customer ka naam aur email
        .sort({ createdAt: -1 });
    } 
    else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Cook or Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check karein ki kya current user is order ka cook hai ya admin hai
    if (req.user.role !== 'admin' && order.cook.toString() !== req.user.userId) {
       return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();
    
    res.status(200).json({ message: 'Order status updated successfully!', order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};