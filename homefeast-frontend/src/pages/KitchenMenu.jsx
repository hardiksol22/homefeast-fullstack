import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Path check kar lena bhai

const KitchenMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const token = user?.token || user?.user?.token;
  const userRole = user?.role || user?.user?.role;

  // 🛡️ SECURITY LAYER: Chefs ko dusre kitchen ka menu access karne se rokna
  useEffect(() => {
    if (userRole === 'cook') {
      toast.error("Chefs cannot order from other kitchens! 👨‍🍳", { id: 'menu-security' });
      navigate('/cook-dashboard');
    }
  }, [userRole, navigate]);

  const [kitchen, setKitchen] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 FETCH KITCHEN & MENU DATA
  useEffect(() => {
    const fetchKitchenAndMenu = async () => {
      try {
        const cooksRes = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        if (cooksRes.ok) {
          const cooksData = await cooksRes.json();
          const currentKitchen = cooksData.find(c => c._id === id);
          setKitchen(currentKitchen);
        }

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

  // 🛒 ADD TO CART FUNCTION
  const handleAddToCart = async (dishId, dishName) => {
    if (!token) {
      toast.error("Please login to add items! 🔒");
      navigate('/login');
      return;
    }

    const loadingToast = toast.loading(`Adding ${dishName}...`);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dishId })
      });

      if (response.ok) {
        toast.success(`${dishName} added to cart! 🛒`, { id: loadingToast, style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' } });
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add item.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error.", { id: loadingToast });
    }
  };

  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Chef')}&background=10B981&color=080D12&size=150&bold=true`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] pt-36 flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#10B981] font-bold tracking-widest uppercase text-xs animate-pulse">Entering Kitchen...</p>
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

  // 👥 KITCHEN TEAM LOGIC (Real array if exists, else fallback data)
  const kitchenTeam = kitchen.team || [
    { name: kitchen.user?.name || kitchen.kitchenName || 'Master Chef', role: 'Head Culinary Specialist', experience: '8+ Years' },
    { name: 'Chef Aman', role: 'Traditional Tiffin Expert', experience: '5+ Years' },
    { name: 'Chef Ritu', role: 'Spice & Gravy Master', experience: '6+ Years' }
  ];

  // 🔥 POPULAR DISHES LOGIC: Shuru ki 3 dishes ko 'Popular' me dikhayenge, baaki neeche!
  const popularDishes = dishes.slice(0, 3);
  const regularDishes = dishes.slice(3);

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-24 relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#10B981]/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ================= 1. 🌟 KITCHEN HERO SECTION ================= */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-[#1E293B]">
        <img 
          src={kitchen.image || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80"} 
          alt={kitchen.kitchenName} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-8 lg:px-16 pb-10 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
            <div>
              <span className="px-3 py-1.5 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-lg text-xs font-black uppercase tracking-widest mb-3 inline-block backdrop-blur-md">
                {kitchen.cuisine || 'Multi-Cuisine'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#F8FAFC] mb-2">
                {kitchen.kitchenName}
              </h1>
              <p className="text-[#94A3B8] font-bold flex items-center gap-2">
                <span className="text-[#10B981] text-xl">📍</span> FSSAI Certified Home Kitchen
              </p>
            </div>
            
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-4 md:p-6 rounded-2xl flex items-center gap-6 shadow-2xl">
              <div className="text-center">
                <p className="text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-1">Kitchen Rating</p>
                <p className="text-2xl font-black text-[#F4B942]">⭐ {kitchen.rating || '4.8'}</p>
              </div>
              <div className="w-px h-10 bg-[#263241]"></div>
              <div className="text-center">
                <p className="text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-1">Chef Team</p>
                <p className="text-2xl font-black text-[#10B981]">{kitchenTeam.length} Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. 👥 MEET THE KITCHEN TEAM ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-12 relative z-10">
        <div className="bg-[#111827] border border-[#263241] rounded-[32px] p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B942]/5 rounded-full blur-[80px]"></div>
          
          <div className="mb-8 flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-3">
                <span className="bg-[#F4B942]/20 text-[#F4B942] p-2 rounded-xl border border-[#F4B942]/30">👨‍🍳</span> 
                Meet The Kitchen Team
              </h2>
              <p className="text-sm text-[#94A3B8] font-medium mt-2">The culinary artists preparing your meals today.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {kitchenTeam.map((chef, idx) => (
              <div key={idx} className="bg-[#080D12] border border-[#263241] p-5 rounded-2xl flex items-center gap-5 hover:border-[#10B981]/40 transition-colors shadow-inner group">
                <div className="relative">
                  <img src={getAvatar(chef.name)} alt={chef.name} className="w-16 h-16 rounded-full border-2 border-[#263241] group-hover:border-[#10B981] object-cover transition-colors" />
                  {idx === 0 && <span className="absolute -bottom-2 -right-2 text-lg">👑</span>}
                </div>
                <div>
                  <h4 className="font-black text-[#F8FAFC] text-base group-hover:text-[#10B981] transition-colors">{chef.name}</h4>
                  <p className="text-xs font-bold text-[#F4B942] mt-0.5">{chef.role}</p>
                  <p className="text-[11px] font-semibold text-[#64748B] mt-1 uppercase tracking-widest">{chef.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 3. 🔥 POPULAR DISHES (VIP SECTION) ================= */}
      {popularDishes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-16">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span className="text-[#F43F5E] animate-pulse">🔥</span> 
            Popular Dishes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDishes.map((dish) => (
              <div key={dish._id} className="bg-[#111827]/80 backdrop-blur-md border border-[#F4B942]/30 rounded-[28px] overflow-hidden group shadow-[0_10px_30px_rgba(244,185,66,0.05)] hover:shadow-[0_10px_30px_rgba(244,185,66,0.15)] transition-all transform hover:-translate-y-1">
                <div className="relative h-48 w-full bg-[#1E293B] overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-[#F4B942] text-[#080D12] text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider shadow-lg">Bestseller</div>
                  <div className="absolute bottom-3 left-3 bg-white p-1 rounded-md shadow-md">
                    <span className={`block w-2.5 h-2.5 rounded-full ${dish.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-[#F8FAFC] line-clamp-1 mb-1">{dish.name}</h3>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 mb-4 h-8">{dish.description || 'Special signature dish prepared with secret spices.'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#263241]">
                    <span className="text-2xl font-black text-[#F4B942]">₹{dish.price}</span>
                    <button onClick={() => handleAddToCart(dish._id, dish.name)} className="px-5 py-2.5 bg-[#10B981] text-[#080D12] font-black text-sm rounded-xl hover:bg-[#059669] transition-colors shadow-lg">
                      ADD +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. 🍲 EXPLORE FULL MENU ================= */}
      {dishes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-16">
          <h2 className="text-2xl font-black mb-8 border-b border-[#263241] pb-4 flex items-center gap-3">
            <span>🍲</span> Explore Full Menu <span className="bg-[#1E293B] text-[#94A3B8] px-2 py-1 rounded-md text-xs font-bold">{dishes.length} Items</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularDishes.map((dish) => (
              <div key={dish._id} className="bg-[#111827] border border-[#263241] rounded-[24px] overflow-hidden group flex shadow-md hover:border-[#10B981]/40 transition-all h-[150px]">
                <div className="w-[130px] h-full shrink-0 relative overflow-hidden bg-[#1E293B]">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                  <div className="absolute top-2 left-2 w-4 h-4 rounded bg-white flex items-center justify-center shadow-md">
                    <span className={`w-2 h-2 rounded-full ${dish.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between bg-[#080D12]">
                  <div>
                    <h3 className="text-base font-black text-[#F8FAFC] leading-tight mb-1 line-clamp-1">{dish.name}</h3>
                    <p className="text-[11px] text-[#64748B] line-clamp-2">{dish.description || 'Authentic home cooked meal.'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#263241]">
                    <span className="text-lg font-black text-[#F8FAFC]">₹{dish.price}</span>
                    <button onClick={() => handleAddToCart(dish._id, dish.name)} className="px-4 py-1.5 bg-[#1E293B] text-[#10B981] border border-[#263241] font-black text-xs rounded-lg hover:bg-[#10B981] hover:text-[#080D12] hover:border-[#10B981] transition-all">
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If Menu is Empty */}
      {dishes.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-12">
          <div className="text-center py-20 bg-[#111827]/50 rounded-[32px] border border-[#263241]">
            <span className="text-5xl mb-4 block">🍳</span>
            <h3 className="text-2xl font-black text-[#94A3B8]">The chefs are prepping the menu.</h3>
            <p className="text-[#64748B] mt-2">Check back soon for delicious home-cooked meals!</p>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default KitchenMenu;