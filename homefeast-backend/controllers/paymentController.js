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
    res.status(500).json({ message: "Server error while creating payment order" });
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
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
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

// 🟢 3. GET USER ORDERS
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

// 🛑 4. CANCEL ORDER & INITIATE REFUND (NAYA FUNCTION)
const cancelAndRefundOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // 1. Order find karo
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. Check karo ki order cancel hone layak hai ya nahi
    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage." });
    }

    // 3. Razorpay Setup
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 4. Initiate Refund via Razorpay API
    const refund = await instance.payments.refund(order.razorpayPaymentId);

    if (refund.status === 'processed') {
      // 5. Update Database status
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
    res.status(500).json({ message: "Server error while processing refund." });
  }
};

// YAHAN SE EXPORT HOTA HAI
module.exports = { 
  createOrder, 
  verifyPayment,
  getUserOrders,
  cancelAndRefundOrder // 👈 Naya function yahan export me add kiya gaya hai
};