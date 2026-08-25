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
      
      // 🚀 THE ULTIMATE FIX: Mapping items to match your Order.js Schema exactly!
      const formattedItems = items.map(item => ({
        name: item.dish?.name || item.name || 'Unknown Dish',
        price: item.dish?.price || item.price || 0,
        quantity: item.quantity || 1,
        image: item.dish?.image || item.image || ''
      }));

      const newOrder = new Order({
        user: userId,
        items: formattedItems, // 🟢 Yahan ab formattedItems bhej rahe hain
        totalAmount: totalAmount,
        paymentStatus: 'Completed',
        orderStatus: 'Placed', // 'Placed' hi valid hai aapke schema ke hisaab se
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });

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