import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 🟢 FIX 1: Import paths ko do kadam peeche kiya (../../)
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // 🟢 FIX 2: Naya CartContext laya

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 🟢 FIX 3: Dummy data hata kar asli Context se data liya
  const { cartItems, updateQuantity, removeItem, clearCart, itemTotal } = useCart();

  // Dynamic Bill Calculations (Context se itemTotal automatically aayega)
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const platformFee = itemTotal > 0 ? 15 : 0;
  const grandTotal = itemTotal + deliveryFee + platformFee;

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to place your order!");
      navigate('/login');
      return;
    }
    
    setLoading(true);
    // Yahan hum aage chalkar Razorpay ya Backend Order API connect karenge
    setTimeout(() => {
      setLoading(false);
      toast.success("Order Placed Successfully! 🎉", {
        style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
      });
      clearCart(); // 🟢 Order place hone ke baad cart empty kar diya
      navigate('/orders'); // Order ke baad seedha My Orders page par bhej do
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-20 relative overflow-hidden">
      
      {/* 🌟 Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              Your Cart 🛒
            </h1>
            <p className="text-[#94A3B8] font-medium">Review your items and proceed to checkout.</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] border border-[#263241] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#10B981] transition-all font-bold text-sm">
            ← Continue Ordering
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-16 text-center shadow-xl">
            <span className="text-7xl mb-6 opacity-80 block animate-bounce">🛍️</span>
            <h3 className="text-3xl font-black text-[#F8FAFC] mb-4">Your cart is empty!</h3>
            <p className="text-[#94A3B8] mb-8 max-w-md mx-auto">Looks like you haven't added any delicious home-cooked meals yet.</p>
            <Link to="/explore" className="inline-block px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1">
              Browse Kitchens 🚀
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 📋 CART ITEMS LIST */}
            <div className="w-full lg:w-2/3 space-y-4">
              {/* 🟢 FIX 4: item.id ki jagah item._id use kiya (MongoDB logic) */}
              {cartItems.map((item) => (
                <div key={item._id} className="bg-[#111827]/80 backdrop-blur-md border border-[#263241] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-[#10B981]/50 transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
                  
                  {/* Dish Image */}
                  <div className="hidden sm:block w-20 h-20 bg-[#1E293B] rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full border-2 ${item.type === 'Veg' ? 'border-[#10B981] bg-[#10B981]/20' : 'border-rose-500 bg-rose-500/20'}`}></span>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{item.kitchen || 'Home Chef'}</p>
                    </div>
                    <h3 className="text-xl font-black text-[#F8FAFC] mb-2">{item.name}</h3>
                    <p className="text-xl font-black text-[#10B981]">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#263241] pt-4 sm:pt-0 mt-2 sm:mt-0">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-[#080D12] border border-[#263241] rounded-xl overflow-hidden shadow-inner">
                      <button onClick={() => updateQuantity(item._id, -1)} className="w-10 h-10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors font-bold text-lg">-</button>
                      <span className="w-10 h-10 flex items-center justify-center font-black text-[#F8FAFC]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="w-10 h-10 flex items-center justify-center text-[#10B981] hover:bg-[#1E293B] transition-colors font-black text-lg">+</button>
                    </div>

                    <button onClick={() => removeItem(item._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 💳 ORDER SUMMARY & CHECKOUT */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-8 sticky top-28 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  Bill Details 🧾
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#94A3B8] font-medium">
                    <span>Item Total</span>
                    <span className="text-[#F8FAFC]">₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8] font-medium">
                    <span>Delivery Fee</span>
                    <span className="text-[#F8FAFC]">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8] font-medium">
                    <span>Platform Fee</span>
                    <span className="text-[#F8FAFC]">₹{platformFee}</span>
                  </div>
                </div>

                <div className="border-t border-[#263241] pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-1">To Pay</p>
                      <h2 className="text-4xl font-black text-[#10B981]">₹{grandTotal}</h2>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#10B981] text-[#080D12] font-black text-lg rounded-2xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none flex justify-center items-center gap-2"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout 🚀'}
                </button>
                
                <p className="text-center text-xs text-[#64748B] font-bold uppercase tracking-wider mt-5 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  100% Secure Payment
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;