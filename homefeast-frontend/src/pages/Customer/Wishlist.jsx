import { useState } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  // Saved Favorites Mock state (can be wired to localStorage or backend)
  const [wishlistItems, setWishlistItems] = useState([
    {
      _id: '1',
      kitchenName: "Mom's Special Kitchen",
      cuisine: 'North Indian',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const handleRemove = (id) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== id));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 rounded-full bg-[#111827] border border-[#263241] flex items-center justify-center text-5xl mb-6 shadow-2xl">
          ❤️
        </div>
        <h2 className="text-3xl font-black mb-3">Your Wishlist is Empty</h2>
        <p className="text-[#94A3B8] max-w-md mb-8">Save your favorite home kitchens here so you can re-order quickly.</p>
        <Link to="/explore" className="px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-2xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Explore Kitchens
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-black mb-8">Saved <span className="text-rose-500">Kitchens</span></h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden group hover:border-rose-500/50 transition-all flex flex-col">
              <div className="relative h-48">
                <img src={item.image} alt={item.kitchenName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={() => handleRemove(item._id)} className="absolute top-3 right-3 bg-[#080D12]/80 backdrop-blur-md p-2 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
                  ✕
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">{item.kitchenName}</h3>
                  <p className="text-sm text-[#94A3B8] mb-4">{item.cuisine} • ⭐ {item.rating}</p>
                </div>

                <Link to="/explore" className="w-full text-center py-3 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-colors">
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;