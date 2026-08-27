const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
    
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ message: "Server error while creating payment order: " + error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId, 
      providerId,
      items, 
      totalAmount 
    } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      let resolvedProviderId = providerId || null;
      if (!resolvedProviderId && items && items.length > 0) {
        resolvedProviderId = items[0]?.dish?.cook?._id || items[0]?.dish?.cook || items[0]?.provider || null;
      }

      const formattedItems = items.map(item => ({
        name: item.dish?.name || item.name || 'Unknown Dish',
        price: item.dish?.price || item.price || 0,
        quantity: item.quantity || 1,
        image: item.dish?.image || item.image || ''
      }));

      const newOrder = new Order({
        user: userId,
        provider: resolvedProviderId, 
        items: formattedItems, 
        totalAmount: totalAmount,
        paymentStatus: 'Completed',
        orderStatus: 'Placed', 
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });

      await newOrder.save(); 

      return res.status(200).json({ 
        message: "Payment verified and Order Saved! 🎉",
        order: newOrder 
      });
    } else {
      console.error("Signature Mismatch!");
      return res.status(400).json({ message: "Invalid signature! Payment verification failed." });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ message: "Internal Server Error during verification: " + error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

const cancelAndRefundOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const currentStatus = order.orderStatus || order.status;

    if (!['Placed', 'Pending', 'New'].includes(currentStatus)) {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage." });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const refund = await instance.payments.refund(order.razorpayPaymentId);

    if (refund.status === 'processed' || refund.status === 'pending') {
      order.orderStatus = 'Cancelled';
      order.paymentStatus = 'Refunded';
      await order.save();

      return res.status(200).json({ 
        message: "Order cancelled and Refund initiated successfully! 💸", 
        order 
      });
    } else {
      return res.status(400).json({ message: "Refund failed at payment gateway." });
    }

  } catch (error) {
    console.error("Refund Error:", error);
    res.status(500).json({ message: "Server error while processing refund: " + error.message });
  }
};

const getProviderOrders = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const orders = await Order.find({ provider: providerId })
                              .populate('user', 'name email')
                              .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching provider orders:", error);
    res.status(500).json({ message: "Server error while fetching provider orders" });
  }
};

module.exports = { 
  createOrder, 
  verifyPayment,
  getUserOrders,
  cancelAndRefundOrder,
  getProviderOrders
};