import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user?.token || user?.user?.token;

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // 📡 1. Fetch Real Cart
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter out items where dish might have been deleted from DB
          setCartItems(data.items.filter(item => item.dish !== null));
        }
      } catch (error) {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // 🔢 2. Update Quantity API Call
  const updateQuantity = async (dishId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return; // Prevent 0 quantity (use remove instead)

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ dishId, quantity: newQuantity })
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items.filter(item => item.dish !== null));
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // 🗑️ 3. Remove Item API Call
  const removeItem = async (dishId, name) => {
    try {
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cart/remove/${dishId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items.filter(item => item.dish !== null));
        toast.success(`${name} removed! 🗑️`, { style: { background: '#F43F5E', color: '#fff' } });
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // 🎟️ Apply Promo Code
  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'FEAST50') {
      setDiscount(50);
      toast.success("Promo code applied! ₹50 OFF 🎉", { style: { background: '#10B981', color: '#080D12' }});
    } else {
      setDiscount(0);
      toast.error("Invalid promo code!", { style: { background: '#F43F5E', color: '#fff' }});
    }
  };

  // 💰 Real-time Billing Calculations
  const itemTotal = cartItems.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const platformFee = itemTotal > 0 ? 15 : 0;
  const gst = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + platformFee + gst - discount;

  const handleCheckout = () => {
    if (!token) {
      toast.error("Please login to place order!");
      navigate('/login');
      return;
    }
    toast.loading("Processing your payment...", { duration: 2000 });
    // Yahan backend Checkout/Payment Gateway aayega future mein
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-[88px] pb-12 px-4 sm:px-8 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F4B942]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 flex items-center gap-4">
            Your Cart <span className="text-[#10B981]">🛒</span>
          </h1>
          <p className="text-[#94A3B8] text-lg font-medium">Review your real-time items and checkout.</p>
        </div>

        {!token ? (
           <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] py-20 px-4 text-center shadow-2xl mt-8">
             <h2 className="text-2xl font-black text-[#F8FAFC] mb-3">Please Login to View Cart</h2>
             <Link to="/login" className="inline-block px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl mt-4">Login Now 🚀</Link>
           </div>
        ) : loading ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              {[1, 2].map(i => <div key={i} className="h-32 bg-[#111827] border border-[#263241] rounded-[24px] animate-pulse"></div>)}
            </div>
            <div className="lg:w-1/3 h-96 bg-[#111827] border border-[#263241] rounded-[32px] animate-pulse"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] py-20 px-4 text-center shadow-2xl mt-8">
            <div className="w-24 h-24 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">🍽️</div>
            <h2 className="text-2xl font-black text-[#F8FAFC] mb-3">Your cart is hungry!</h2>
            <Link to="/explore" className="inline-block px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] transform hover:-translate-y-1 mt-4">
              Start Ordering 🚀
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-6 shadow-xl">
                <h3 className="text-lg font-black mb-6 text-[#F8FAFC] flex items-center gap-2">
                  Order Details <span className="bg-[#1E293B] text-[#94A3B8] px-2.5 py-0.5 rounded-md text-xs">{cartItems.length} Items</span>
                </h3>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 p-4 bg-[#080D12] border border-[#263241] rounded-[24px] relative group hover:border-[#10B981]/30 transition-all">
                      
                      <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-[16px] overflow-hidden relative">
                        <img src={item.dish.image} alt={item.dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <span className={`absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-[#080D12] ${item.dish.type === 'Veg' ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`}></span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start pr-8">
                          <div>
                            <h4 className="font-black text-lg text-[#F8FAFC] leading-tight mb-1 line-clamp-1">{item.dish.name}</h4>
                            {/* Hum real backend se data le rahe hain, isliye cook/kitchen name populate na ho toh fallback denge */}
                            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">👨‍🍳 Kitchen Fresh</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-xl font-black text-[#F4B942]">₹{item.dish.price * item.quantity}</p>
                          
                          <div className="flex items-center bg-[#1E293B] rounded-xl p-1 border border-[#263241]">
                            <button onClick={() => updateQuantity(item.dish._id, item.quantity, -1)} className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#080D12] rounded-lg transition-all font-bold">
                              -
                            </button>
                            <span className="w-8 text-center font-black text-[#F8FAFC]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.dish._id, item.quantity, 1)} className="w-8 h-8 flex items-center justify-center text-[#10B981] hover:text-[#10B981] hover:bg-[#080D12] rounded-lg transition-all font-bold">
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeItem(item.dish._id, item.dish.name)}
                        className="absolute top-4 right-4 text-[#64748B] hover:text-[#F43F5E] bg-[#1E293B] hover:bg-[#F43F5E]/10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-6 shadow-2xl sticky top-[100px]">
                
                <form onSubmit={applyPromo} className="mb-6 relative">
                  <input 
                    type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Promo Code" 
                    className="w-full bg-[#080D12] border border-[#263241] text-[#F8FAFC] px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#10B981] transition-all text-sm font-bold uppercase tracking-wider placeholder:normal-case placeholder:font-normal"
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-[#1E293B] text-[#F8FAFC] text-xs font-black rounded-lg hover:bg-[#10B981] hover:text-[#080D12] transition-colors uppercase">
                    Apply
                  </button>
                </form>

                <h3 className="text-lg font-black mb-4 text-[#F8FAFC]">Bill Summary</h3>
                
                <div className="space-y-3 text-sm font-medium text-[#94A3B8] border-b border-[#263241] pb-4 mb-4">
                  <div className="flex justify-between"><span>Item Total</span><span className="text-[#F8FAFC] font-bold">₹{itemTotal}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span className="text-[#F8FAFC] font-bold">₹{deliveryFee}</span></div>
                  <div className="flex justify-between"><span>Platform Fee</span><span className="text-[#F8FAFC] font-bold">₹{platformFee}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span className="text-[#F8FAFC] font-bold">₹{gst}</span></div>
                  {discount > 0 && <div className="flex justify-between text-[#10B981] font-bold"><span>Promo Discount</span><span>- ₹{discount}</span></div>}
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">To Pay</p>
                    <h3 className="text-3xl font-black text-[#10B981]">₹{grandTotal}</h3>
                  </div>
                </div>

                <button onClick={handleCheckout} className="w-full py-4 bg-[#10B981] text-[#080D12] font-black text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1">
                  Proceed to Checkout 💳
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;