import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; 
import toast from 'react-hot-toast';

const ProviderDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { addToCart, cart } = useCart(); 
  
  const [provider, setProvider] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        // 🟢 REAL LIVE BACKEND URL
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch provider details');
        
        const data = await response.json();
        setProvider(data.profile);
        setMenu(data.menu || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  const handleAddToCart = (item) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    
    addToCart(item, provider.kitchenName); 
    toast.success(`Added ${item.dishName} to cart! 🛒`, {
      style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-[#080D12] flex flex-col justify-center items-center text-rose-500 font-bold gap-4 pt-20">
        <span className="text-6xl animate-bounce">⚠️</span>
        <p className="text-2xl text-[#F8FAFC]">Kitchen Not Found</p>
        <p className="text-[#94A3B8] max-w-md text-center">{error || "This kitchen might be closed or doesn't exist in our database."}</p>
        <Link to="/explore" className="mt-4 px-6 py-3 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-colors">
          Go back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-24 relative">
      
      {/* 🌟 1. PREMIUM HERO BANNER */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden bg-[#1E293B]">
        <img 
          src={provider.image || "https://images.unsplash.com/photo-1585937421612-70a008356fbe"} 
          alt={provider.kitchenName} 
          className="w-full h-full object-cover opacity-50 scale-105" 
        />
        {/* Gradient overlays for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080D12]/80 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link to="/explore" className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC] bg-[#111827]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#263241] hover:bg-[#111827] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            Back
          </Link>
        </div>

        {/* Kitchen Info on Banner */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 max-w-[1400px] mx-auto z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-[#10B981]/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest border border-[#10B981]/30">FSSAI Certified</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">{provider.kitchenName}</h1>
              <p className="text-[#94A3B8] text-lg font-medium flex items-center gap-2">
                <span className="text-[#F8FAFC]">Chef {provider.user?.name}</span> • {provider.cuisine ? provider.cuisine : 'Multi-cuisine'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#111827]/80 backdrop-blur-md border border-[#263241] px-5 py-3 rounded-2xl shadow-xl">
              <span className="text-2xl font-black text-[#F4B942]">⭐ {provider.rating || '4.8'}</span>
              <div className="w-[1px] h-8 bg-[#263241] mx-2"></div>
              <div className="text-xs text-[#94A3B8] font-bold">100+<br/>Ratings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Section Title */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-[#F8FAFC] uppercase tracking-wide">Recommended Menu</h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#263241] to-transparent"></div>
        </div>

        {/* 🍔 2. SWIGGY-STYLE MENU LIST */}
        <div className="max-w-4xl mx-auto">
          {menu.length === 0 ? (
            <div className="text-center py-20 bg-[#111827] rounded-3xl border border-[#263241] shadow-lg">
              <span className="text-6xl mb-4 block opacity-50">👨‍🍳</span>
              <h3 className="text-xl font-bold text-[#F8FAFC]">Menu Not Available</h3>
              <p className="text-[#94A3B8] mt-2">The chef hasn't added any dishes to their menu yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {menu.map((item, index) => (
                <div key={item._id} className="bg-[#111827] border border-[#263241] p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row justify-between gap-6 group hover:border-[#10B981]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
                  
                  {/* Left Side: Dish Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {/* Veg/Non-Veg Icon */}
                      <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${item.mealType === 'Non-Veg' ? 'border-rose-500' : 'border-[#10B981]'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.mealType === 'Non-Veg' ? 'bg-rose-500' : 'bg-[#10B981]'}`}></div>
                      </div>
                      {index === 0 && <span className="text-[#F4B942] text-[10px] font-black uppercase tracking-wider bg-[#F4B942]/10 px-2 py-0.5 rounded">Bestseller</span>}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-1">{item.dishName}</h3>
                    <p className="text-lg font-black text-[#F8FAFC] mb-3">₹{item.price}</p>
                    <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-2 pr-4">{item.description}</p>
                    
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-[#080D12] text-[#64748B] text-[10px] font-bold uppercase rounded border border-[#263241]">
                        {item.planType} Plan
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Image & Add Button */}
                  <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-2xl flex-shrink-0">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                      alt={item.dishName} 
                      className="w-full h-full object-cover rounded-2xl border border-[#263241] shadow-lg"
                    />
                    
                    {/* Zomato Style Floating ADD Button */}
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#080D12] text-[#10B981] font-black px-8 py-2.5 rounded-xl border border-[#10B981] shadow-[0_5px_15px_rgba(16,185,129,0.2)] hover:bg-[#10B981] hover:text-[#080D12] transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-1 group-hover:shadow-[0_5px_20px_rgba(16,185,129,0.4)]"
                    >
                      ADD <span className="text-lg leading-none mb-0.5">+</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🛒 3. STICKY BOTTOM CART BAR (Shows only if items in cart) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#10B981] text-[#080D12] shadow-[0_-10px_40px_rgba(16,185,129,0.4)] animate-fade-in-up">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Your Order</p>
              <p className="font-black text-lg sm:text-xl">
                {cart.length} ITEM{cart.length > 1 ? 'S' : ''} ADDED
              </p>
            </div>
            <Link 
              to="/cart" 
              className="flex items-center gap-2 bg-[#080D12] text-[#F8FAFC] px-6 py-3 rounded-xl font-black hover:bg-[#111827] transition-colors"
            >
              View Cart
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderDetails;