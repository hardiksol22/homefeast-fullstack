const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order'); // MongoDB Order Model

// 🟢 1. CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // Paise me convert kiya
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

// 🟢 2. VERIFY PAYMENT & SAVE ORDER
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId, 
      items, 
      totalAmount 
    } = req.body;
    
    console.log("Verifying payment for Order ID:", razorpay_order_id);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      // 🚀 FIX: Extracting Provider ID from the cart items
      // Cart items mein se kitchen/provider ki ID nikal rahe hain taaki DB naraz na ho
      const providerId = items[0]?.dish?.cook?._id || items[0]?.dish?.cook || items[0]?.provider || null;

      const newOrder = new Order({
        user: userId,
        provider: providerId, // 🟢 FIX: Added missing provider field!
        items: items,
        totalAmount: totalAmount,
        paymentStatus: 'Completed',
        orderStatus: 'Pending', // 🟢 FIX: Changed 'Placed' to 'Pending'
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });

      // Ab database isko 100% khushi-khushi save karega
      await newOrder.save(); 

      return res.status(200).json({ 
        message: "Payment verified and Order Saved! 🎉",
        order: newOrder 
      });
    } else {
      console.error("Signature Mismatch! Expected:", expectedSign, "Got:", razorpay_signature);
      return res.status(400).json({ message: "Invalid signature! Payment verification failed." });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ message: "Internal Server Error during verification: " + error.message });
  }
};

// 🟢 3. GET USER ORDERS
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    // user aur provider dono ko populate kar rahe hain taaki frontend par details dikhe
    const orders = await Order.find({ user: userId })
      .populate('provider', 'kitchenName name email') 
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// 🛑 4. CANCEL ORDER & INITIATE REFUND
const cancelAndRefundOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Pending ya New status wale hi cancel ho sakte hain
    if (!['Placed', 'Pending', 'New'].includes(order.orderStatus)) {
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

module.exports = { 
  createOrder, 
  verifyPayment,
  getUserOrders,
  cancelAndRefundOrder 
};