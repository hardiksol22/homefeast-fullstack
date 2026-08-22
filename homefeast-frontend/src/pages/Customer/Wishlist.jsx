import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";
const Wishlist = () => {
  const { user } = useAuth();
  const token = user?.token || user?.user?.token;
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // 📡 Fetch Real Wishlist from Backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // data mein populated 'dish' object aayega
          setWishlistItems(data.map(item => item.dish).filter(Boolean));
        }
      } catch (error) {
        console.error("Wishlist Fetch Error:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWishlist();
  }, [token]);

  // 🗑️ Remove from Wishlist API Call
  const handleRemove = async (dishId, name) => {
    try {
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/wishlist/${dishId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item._id !== dishId));
        toast.success(`${name} removed from wishlist! 🗑️`, {
          style: { background: '#F43F5E', color: '#fff', fontWeight: 'bold' }
        });
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const filteredItems = wishlistItems.filter(item => filter === 'All' || item.type === filter);

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-[88px] pb-12 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 flex items-center gap-4">
              Your Cravings <span className="text-[#F43F5E]">❤️</span>
            </h1>
            <p className="text-[#94A3B8] text-lg font-medium">Your personalized collection from the database.</p>
          </div>
          
          <div className="bg-[#111827] border border-[#263241] p-1.5 rounded-xl flex items-center shadow-lg">
            {['All', 'Veg', 'Non-Veg'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  filter === type 
                  ? 'bg-[#F8FAFC] text-[#080D12] shadow-md'
                  : 'text-[#64748B] hover:text-[#F8FAFC]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#111827] border border-[#263241] rounded-[24px] h-[380px] animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] py-20 px-4 text-center shadow-2xl mt-8">
            <div className="w-24 h-24 bg-[#F43F5E]/10 text-[#F43F5E] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">💔</div>
            <h2 className="text-2xl font-black text-[#F8FAFC] mb-3">Your wishlist is empty!</h2>
            <Link to="/explore" className="inline-block px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all mt-4">
              Explore Menu 🚀
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-[#111827] border border-[#263241] rounded-[24px] overflow-hidden group flex flex-col shadow-lg relative">
                <button 
                  onClick={() => handleRemove(item._id, item.name)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#080D12]/60 backdrop-blur-md rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#F43F5E] transition-all border border-[#263241]"
                >
                  ✕
                </button>
                <div className="relative h-56 w-full bg-[#1E293B] overflow-hidden">
                  <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-[#F8FAFC] mb-2">{item.name}</h3>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#263241]">
                    <p className="text-2xl font-black text-[#F4B942]">₹{item.price}</p>
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

export default Wishlist; // Or export default Wishlist