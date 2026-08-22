import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
const KitchenMenu = () => {
  const { id } = useParams(); // URL se provider/cook ki ID mil jayegi
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token || user?.user?.token;

  const [kitchen, setKitchen] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 FETCH KITCHEN DETAILS & MENU
  useEffect(() => {
    const fetchKitchenAndMenu = async () => {
      try {
        // 1. Kitchen ki details fetch karein (Ya poori list se filter kar lein)
        const cooksRes = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        if (cooksRes.ok) {
          const cooksData = await cooksRes.json();
          const currentKitchen = cooksData.find(c => c._id === id);
          setKitchen(currentKitchen);
        }

        // 2. Us specific kitchen ki DISHES fetch karein (Aapke cookController ke getMenu se)
        const menuRes = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${id}/menu`);
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setDishes(menuData);
        }
      } catch (error) {
        console.error("Error loading menu:", error);
        toast.error("Failed to load kitchen menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenAndMenu();
  }, [id]);

  // 🛒 REAL ADD TO CART API CALL
  const handleAddToCart = async (dishId, dishName) => {
    if (!token) {
      toast.error("Please login to add items! 🔒");
      navigate('/login');
      return;
    }

    const loadingToast = toast.loading(`Adding ${dishName} to cart...`);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dishId }) // 🟢 Sirf ID bhej rahe hain, price backend sambhalega
      });

      if (response.ok) {
        toast.success(`${dishName} added to cart! 🛒`, { 
          id: loadingToast,
          style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' } 
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add item.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error while adding to cart.", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] pt-36 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-[#080D12] pt-36 text-center text-[#F8FAFC]">
        <h2 className="text-3xl font-black mb-4">Kitchen Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#10B981] text-[#080D12] rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-20">
      
      {/* 🌟 1. HERO SECTION (Kitchen & Chef Info) */}
      <div className="relative w-full h-[400px] bg-[#1E293B]">
        <img 
          src={kitchen.image || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80"} 
          alt={kitchen.kitchenName} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-8 lg:px-16 pb-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-lg text-xs font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">
                {kitchen.cuisine || 'Multi-Cuisine'}
              </span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#F8FAFC] mb-2 shadow-sm">
                {kitchen.kitchenName}
              </h1>
              <p className="text-xl text-[#94A3B8] font-semibold flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span> by {kitchen.name || 'Home Chef'}
              </p>
            </div>
            
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-4 rounded-2xl flex items-center gap-6 shadow-2xl">
              <div className="text-center">
                <p className="text-sm text-[#64748B] font-bold uppercase tracking-wider mb-1">Rating</p>
                <p className="text-2xl font-black text-[#F4B942] flex items-center justify-center gap-1">
                  ⭐ {kitchen.rating || '4.8'}
                </p>
              </div>
              <div className="w-px h-12 bg-[#263241]"></div>
              <div className="text-center">
                <p className="text-sm text-[#64748B] font-bold uppercase tracking-wider mb-1">FSSAI</p>
                <p className="text-lg font-black text-[#10B981]">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🍲 2. DISHES MENU SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-12 relative z-20">
        <h2 className="text-3xl font-black mb-8 border-b border-[#263241] pb-4 flex items-center gap-3">
          Recommended Dishes <span className="text-[#10B981] text-lg">({dishes.length})</span>
        </h2>

        {dishes.length === 0 ? (
          <div className="text-center py-20 bg-[#111827]/50 rounded-[32px] border border-[#263241]">
            <span className="text-5xl mb-4 block">👨‍🍳</span>
            <h3 className="text-2xl font-black text-[#94A3B8]">Menu is empty right now.</h3>
            <p className="text-[#64748B] mt-2">The chef is preparing something special!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {dishes.map((dish) => (
              <div key={dish._id} className="bg-[#111827] border border-[#263241] rounded-[24px] overflow-hidden group flex shadow-lg hover:border-[#10B981]/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all h-[180px]">
                
                {/* Image (Left Side) */}
                <div className="w-[140px] h-full shrink-0 relative overflow-hidden bg-[#1E293B]">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute top-2 left-2 w-4 h-4 rounded bg-white flex items-center justify-center shadow-md`}>
                    <span className={`w-2 h-2 rounded-full ${dish.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </div>
                </div>

                {/* Details (Right Side) */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#F8FAFC] leading-tight mb-1 line-clamp-2">{dish.name}</h3>
                    <p className="text-xs text-[#64748B] line-clamp-2">{dish.description || 'Prepared fresh and served hot.'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#263241]">
                    <span className="text-2xl font-black text-[#F4B942]">₹{dish.price}</span>
                    
                    {/* 🛒 The Real Add to Cart Button */}
                    <button 
                      onClick={() => handleAddToCart(dish._id, dish.name)}
                      className="px-4 py-2 bg-[#10B981]/10 text-[#10B981] font-black text-sm rounded-lg border border-[#10B981]/30 hover:bg-[#10B981] hover:text-[#080D12] transition-colors shadow-sm transform hover:-translate-y-0.5"
                    >
                      ADD +
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default KitchenMenu;