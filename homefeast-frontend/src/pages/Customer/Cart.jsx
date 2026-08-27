import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
// 🟢 FIX 1: Naya import tareeka
import autoTable from 'jspdf-autotable'; 

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const token = user?.token || user?.user?.token;
  const currentUser = user?.user || user;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPay, setProcessingPay] = useState(false);

  // 📡 FETCH CART DATA
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || data);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCart();
    else {
      toast.error("Please login to view cart");
      navigate('/login');
    }
  }, [token, navigate]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item));
    try {
      await fetch('https://homefeast-fullstack.onrender.com/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
    toast.success("Item removed");
    try {
      await fetch(`https://homefeast-fullstack.onrender.com/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      toast.error("Failed to remove item from server");
    }
  };

  // 💰 CALCULATIONS
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.dish?.price || item.price || 0) * item.quantity), 0);
  const platformFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const deliveryFee = subtotal > 0 ? 0 : 0;
  const grandTotal = subtotal + platformFee + deliveryFee;

  // 📄 GENERATE SECURE TAX INVOICE (PDF)
  const generatePDFInvoice = (orderId, paymentId) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFillColor(8, 13, 18); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(16, 185, 129); 
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("HomeFeast", 14, 25);
    
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("FSSAI Certified Home Kitchens", 14, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE / RECEIPT", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // 🟢 FIX: String conversion for safety
    const safeOrderId = String(orderId || 'NEW');
    
    doc.text(`Order ID: #ORD-${safeOrderId.slice(-6).toUpperCase()}`, 14, 65);
    doc.text(`Payment Ref: ${paymentId}`, 14, 72);
    doc.text(`Date: ${date}`, 14, 79);
    doc.text(`Billed To: ${currentUser?.name || 'Customer'}`, 14, 86);
    doc.text(`Email: ${currentUser?.email || 'customer@homefeast.com'}`, 14, 93);
    doc.text(`Payment Status: PAID (Securely processed via Razorpay)`, 14, 100);

    const tableColumn = ["Item Description", "Kitchen Name", "Price", "Qty", "Total"];
    const tableRows = [];

    cartItems.forEach(item => {
      const itemData = [
        item.dish?.name || item.name || 'Dish',
        item.dish?.cook?.kitchenName || 'Home Kitchen',
        `Rs. ${item.dish?.price || item.price}`,
        item.quantity,
        `Rs. ${(item.dish?.price || item.price) * item.quantity}`
      ];
      tableRows.push(itemData);
    });

    tableRows.push(["Platform Fee (5%)", "-", "-", "-", `Rs. ${platformFee}`]);
    tableRows.push(["Delivery Partner Fee", "-", "-", "-", `Rs. ${deliveryFee}`]);

    // 🟢 FIX 2: Naya autoTable function use kiya
    autoTable(doc, {
      startY: 110,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = doc.lastAutoTable?.finalY || 110;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(`Grand Total Paid: Rs. ${grandTotal}`, 130, finalY + 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for choosing HomeFeast! Support your local home chefs. 🍲", 14, finalY + 35);
    doc.text("This is an electronically generated invoice.", 14, finalY + 42);

    doc.save(`HomeFeast_Invoice_${safeOrderId.slice(-6).toUpperCase()}.pdf`);
  };

  // 🛡️ LOAD RAZORPAY SCRIPT SECURELY
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 💳 REAL SECURE PAYMENT PROCESS
  const handleRealPayment = async () => {
    if (cartItems.length === 0) return toast.error("Your cart is empty!");
    
    setProcessingPay(true);
    
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your internet connection.");
      setProcessingPay(false);
      return;
    }

    try {
      const createOrderRes = await fetch('https://homefeast-fullstack.onrender.com/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: grandTotal }) 
      });

      if (!createOrderRes.ok) {
        throw new Error("Backend failed to create Razorpay Order. Have you integrated backend payment keys?");
      }

      const orderData = await createOrderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HomeFeast",
        description: "Fresh Homemade Food Order",
        image: "https://your-logo-url.png",
        order_id: orderData.id, 
        handler: async function (response) {
          try {
            toast.loading("Verifying Secure Payment...", { id: "verifying" });
            
            const verifyRes = await fetch('https://homefeast-fullstack.onrender.com/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: currentUser?._id, 
                // 🚀 FIX: Frontend se direct Cook(Provider) ki ID bhej rahe hain
                providerId: cartItems[0]?.dish?.cook?._id || cartItems[0]?.dish?.cook || cartItems[0]?.provider || null,
                items: cartItems,
                totalAmount: grandTotal
              })
            });

            if (verifyRes.ok) {
              const finalOrder = await verifyRes.json();
              const dbOrderId = finalOrder.order?._id || finalOrder._id || "ORD12345";
              
              toast.success("Payment Verified & Order Placed! 🎉", { id: "verifying" });
              
              try {
                generatePDFInvoice(dbOrderId, response.razorpay_payment_id);
              } catch (pdfErr) {
                console.error("PDF Error:", pdfErr);
                toast.error("Invoice generation failed, but order is placed!");
              }

              // Clear Cart
              await fetch('https://homefeast-fullstack.onrender.com/api/cart/clear', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });

              setCartItems([]);
              navigate('/orders');
            } else {
              toast.error("Payment successful, but order verification failed!", { id: "verifying" });
            }
          } catch (err) {
            toast.error("Critical error during verification.", { id: "verifying" });
          }
        },
        prefill: {
          name: currentUser?.name || "Customer",
          email: currentUser?.email || "",
          contact: currentUser?.phone || ""
        },
        theme: {
          color: "#10B981" 
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to initiate secure payment.");
    } finally {
      setProcessingPay(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] pt-36 flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#10B981] font-bold tracking-widest uppercase text-xs animate-pulse">Loading Cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black mb-8 flex items-center gap-4">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-16 text-center shadow-xl">
            <span className="text-7xl mb-6 opacity-60 block">🍽️</span>
            <h3 className="text-3xl font-black text-[#F8FAFC] mb-4">Your cart is feeling light</h3>
            <p className="text-[#94A3B8] mb-8 text-lg">Add some delicious home-cooked meals to get started!</p>
            <Link to="/explore" className="px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all shadow-lg text-lg">
              Explore Kitchens
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* CART ITEMS LIST */}
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-[#111827] border border-[#263241] rounded-[24px] p-4 flex gap-5 items-center shadow-lg hover:border-[#10B981]/30 transition-colors group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#1E293B] shrink-0">
                    <img 
                      src={item.dish?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"} 
                      alt={item.dish?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-black text-[#F8FAFC] line-clamp-1">{item.dish?.name || item.name}</h3>
                      <button onClick={() => removeItem(item._id)} className="text-[#F43F5E] hover:text-red-400 p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#10B981] mb-2">{item.dish?.cook?.kitchenName || 'Home Kitchen'}</p>
                    <p className="text-sm font-black text-[#F4B942]">₹{item.dish?.price || item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#080D12] border border-[#263241] rounded-xl px-2 py-1">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] font-bold text-lg">-</button>
                    <span className="w-4 text-center font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#10B981] hover:text-[#059669] font-bold text-lg">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAYMENT & SUMMARY PANEL */}
            <div className="lg:w-1/3">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-6 sm:p-8 shadow-2xl sticky top-32">
                <h2 className="text-xl font-black mb-6 border-b border-[#263241] pb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#94A3B8] font-medium"><span>Subtotal</span><span className="text-[#F8FAFC]">₹{subtotal}</span></div>
                  <div className="flex justify-between text-[#94A3B8] font-medium"><span>Platform Fee (5%)</span><span className="text-[#F8FAFC]">₹{platformFee}</span></div>
                  <div className="flex justify-between text-[#94A3B8] font-medium"><span>Delivery Partner Fee</span><span className="text-[#F8FAFC]">₹{deliveryFee}</span></div>
                </div>
                <div className="flex justify-between items-center border-t border-[#263241] pt-6 mb-8">
                  <span className="text-lg font-bold text-[#F8FAFC]">Grand Total</span>
                  <span className="text-3xl font-black text-[#10B981]">₹{grandTotal}</span>
                </div>

                <button 
                  onClick={handleRealPayment}
                  disabled={processingPay}
                  className="w-full py-4 bg-[#10B981] text-[#080D12] text-lg font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-80 flex flex-col items-center justify-center"
                >
                  {processingPay ? (
                    <span className="w-6 h-6 border-4 border-[#080D12] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "🔒 Pay Securely via Razorpay"
                  )}
                </button>
                <div className="mt-6 flex justify-center gap-4 opacity-60">
                  <span className="text-2xl" title="UPI">📱</span><span className="text-2xl" title="Cards">💳</span><span className="text-2xl" title="Net Banking">🏦</span>
                </div>
                <p className="text-center text-[10px] font-bold text-[#64748B] mt-4 uppercase tracking-widest">100% Real, Secure & Encrypted</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;