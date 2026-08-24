import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 
import { useCart } from '../../context/CartContext'; 

const ProviderMenu = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  
  const { addToCart, cartCount } = useCart();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${id}/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        } else {
          toast.error("Failed to load menu");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Server connection error.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleAddToCart = (dish) => {
    if (!user) {
      toast.error("Please Sign In to order delicious food! 🍔", {
        style: { background: '#F43F5E', color: '#F8FAFC', fontWeight: 'bold' }
      });
      navigate('/login');
      return; 
    }
    // Seedha Context me add karo (Kitchen Name ke sath)
    addToCart(dish, "Chef's Kitchen"); 
  };

  const SkeletonLoader = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-[#111827] border border-[#263241] rounded-3xl animate-pulse">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/2 bg-[#1E293B] rounded"></div>
            <div className="h-4 w-1/4 bg-[#1E293B] rounded"></div>
            <div className="h-10 w-full bg-[#1E293B] rounded mt-4"></div>
          </div>
          <div className="h-32 w-full sm:w-40 bg-[#1E293B] rounded-2xl"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-24 selection:bg-[#10B981] selection:text-[#080D12]">
      
      {/* 🌟 HERO BANNER (Zomato Style) */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-[#1E293B] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80" 
          alt="Kitchen Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/60 to-transparent"></div>
        
        {/* Floating Back Button & Cart (Top) */}
        <div className="absolute top-24 left-0 right-0 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center z-20">
          <Link to="/explore" className="w-10 h-10 rounded-full bg-[#080D12]/80 backdrop-blur-md border border-[#263241] flex items-center justify-center text-[#F8FAFC] hover:text-[#10B981] transition-colors shadow-lg">
            ←
          </Link>
          
          <Link to="/cart" className="relative group block">
            <div className="w-10 h-10 rounded-full bg-[#080D12]/80 backdrop-blur-md border border-[#263241] flex items-center justify-center text-[#F8FAFC] group-hover:text-[#10B981] group-hover:border-[#10B981] transition-all shadow-lg cursor-pointer">
              🛒
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#10B981] text-[#080D12] w-5 h-5 flex items-center justify-center rounded-full text-xs font-black animate-bounce shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Kitchen Info (Bottom of Banner) */}
        <div className="absolute bottom-8 left-0 right-0 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">Accepting Orders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">Kitchen Menu</h1>
          <p className="text-[#94A3B8] font-medium text-sm md:text-base flex items-center gap-3">
            <span>⭐ 4.8 Rating</span>
            <span className="w-1 h-1 rounded-full bg-[#64748B]"></span>
            <span>FSSAI Verified 🛡️</span>
          </p>
        </div>
      </div>

      {/* 📜 MENU SECTION */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        
        {loading ? (
          <SkeletonLoader />
        ) : menu.length === 0 ? (
          <div className="bg-[#111827] border border-[#263241] rounded-3xl p-12 text-center shadow-xl">
            <span className="text-6xl mb-6 opacity-80 block">👨‍🍳</span>
            <h3 className="text-2xl font-black text-[#F8FAFC] mb-3">Menu is empty right now</h3>
            <p className="text-[#94A3B8] max-w-md mx-auto mb-6">The chef hasn't published any dishes yet. Check back in a while!</p>
            <Link to="/explore" className="px-6 py-3 bg-[#10B981]/10 text-[#10B981] font-bold rounded-xl border border-[#10B981]/20 hover:bg-[#10B981] hover:text-[#080D12] transition-colors">
              Browse Other Kitchens
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-xl font-black tracking-wide flex items-center gap-2">
                <span>Recommended</span>
                <span className="px-2 py-0.5 rounded-md bg-[#F4B942]/10 text-[#F4B942] text-[10px] uppercase border border-[#F4B942]/20">Chef's Special</span>
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#263241] to-transparent"></div>
            </div>

            {/* 🍲 ZOMATO STYLE DISH CARDS */}
            {menu.map((dish) => (
              <div key={dish._id} className="group flex flex-col-reverse sm:flex-row justify-between gap-6 p-6 bg-[#111827] border border-[#263241] rounded-3xl hover:border-[#10B981]/40 hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)] transition-all duration-300">
                
                {/* Left Side: Dish Info */}
                <div className="flex-1 flex flex-col justify-center">
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${dish.type === 'Veg' ? 'border-[#10B981]' : dish.type === 'Non-Veg' ? 'border-rose-500' : 'border-yellow-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.type === 'Veg' ? 'bg-[#10B981]' : dish.type === 'Non-Veg' ? 'bg-rose-500' : 'bg-yellow-500'}`}></span>
                    </div>
                    {dish.type === 'Veg' && <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest bg-[#10B981]/10 px-2 py-0.5 rounded">Bestseller</span>}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC] mb-1">{dish.name}</h3>
                  <p className="text-lg font-black text-[#F8FAFC] mb-3 flex items-center gap-2">
                    ₹{dish.price} 
                    <span className="text-xs font-medium text-[#64748B] line-through">₹{dish.price + 50}</span>
                  </p>
                  
                  <p className="text-[#94A3B8] text-sm md:text-base line-clamp-2 leading-relaxed mb-4">
                    {dish.description || "A delicious homemade meal prepared with love, hygiene, and the finest local ingredients."}
                  </p>

                  <button 
                    onClick={() => handleAddToCart(dish)} 
                    className="w-max hidden sm:flex items-center gap-2 px-6 py-2.5 bg-[#080D12] text-[#10B981] font-black rounded-xl border border-[#263241] hover:border-[#10B981] hover:bg-[#10B981]/10 transition-colors"
                  >
                    ADD TO CART <span className="text-lg">+</span>
                  </button>
                </div>

                {/* Right Side: Image & Mobile Button */}
                <div className="relative w-full sm:w-40 md:w-48 h-48 sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-[#1E293B]">
                  <img 
                    src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"} 
                    alt={dish.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:hidden pb-8">
                    <button 
                      onClick={() => handleAddToCart(dish)} 
                      className="px-8 py-2 bg-[#F8FAFC] text-[#080D12] text-sm font-black rounded-xl border border-[#E2E8F0] shadow-xl hover:bg-[#10B981] hover:text-[#080D12] hover:border-[#10B981] transition-colors"
                    >
                      ADD
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

export default ProviderMenu;