const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order'); // MongoDB Order Model

// 🟢 1. CREATE ORDER (Frontend jab Checkout dabayega)
const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // Amount ko paise me convert kiya
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
    
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ message: "Server error while creating payment order" });
  }
};

// 🟢 2. VERIFY PAYMENT & SAVE ORDER TO DATABASE
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
    
    // Security ke liye signature verify karna
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      // Signature match hone par naya order MongoDB me save karna
      const newOrder = new Order({
        user: userId,
        items: items,
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
      return res.status(400).json({ message: "Invalid signature! Security breach detected." });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ message: "Internal Server Error during verification" });
  }
};

// 🟢 3. GET USER ORDERS (Frontend par "My Orders" page ke liye)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    // User ke saare orders nikalo aur naye wale sabse upar dikhao (-1)
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// Saare functions ko routes me use karne ke liye export kiya
module.exports = { 
  createOrder, 
  verifyPayment,
  getUserOrders
};