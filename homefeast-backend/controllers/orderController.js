const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new subscription/order (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { cookId, plan, totalAmount, deliveryAddress } = req.body;
    
    // 🚀 FIX: Naye Schema ke according 'user' aur 'provider' ko map kiya
    const newOrder = new Order({
      user: req.user.userId || req.user._id || req.user.id, 
      provider: cookId,
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
    const userId = req.user.userId || req.user._id || req.user.id;
    
    // Agar user Customer hai
    if (req.user.role === 'customer') {
      orders = await Order.find({ user: userId })
        .populate('provider', 'name') // 🚀 FIX: 'cook' ki jagah 'provider' ko populate kiya
        .sort({ createdAt: -1 });
    } 
    // Agar user Cook hai
    else if (req.user.role === 'cook') {
      orders = await Order.find({ provider: userId }) // 🚀 FIX: 'cook' ki jagah 'provider' filter lagaya
        .populate('user', 'name email') 
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
    // 🚀 FIX: Frontend dono variables bhej raha hai (status aur orderStatus)
    const { status, orderStatus } = req.body; 
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // 🚀 FIX: Security check mein order.cook ki jagah order.provider use kiya (Taki server crash na ho)
    const currentUserId = req.user.userId || req.user._id || req.user.id;
    const providerId = order.provider ? order.provider.toString() : null;

    if (req.user.role !== 'admin' && providerId && providerId !== currentUserId.toString()) {
       return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // 🚀 FIX: Database mein Schema ke exact naam 'orderStatus' ko update kiya
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (status) {
      // Dono conditions sync rakhi hain safety ke liye
      order.status = status; 
      order.orderStatus = status; 
    }

    await order.save();
    
    res.status(200).json({ message: 'Order status updated successfully!', order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};