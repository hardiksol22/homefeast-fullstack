import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");

  const cuisines = ["All", "North Indian", "South Indian", "Healthy", "Punjabi", "Keto", "Maharashtrian", "Bengali"];

  // 📸 SMART PHOTO ENGINE
  const getKitchenImage = (provider) => {
    if (provider.image && provider.image.length > 10) {
      return provider.image;
    }
    
    const cuisineImages = {
      "North Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      "South Indian": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      "Healthy": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      "Punjabi": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80",
      "Keto": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
      "Maharashtrian": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80",
      "Bengali": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80"
    };

    return cuisineImages[provider.cuisine] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
  };

  useEffect(() => {
    const fetchCooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        
        if (response.ok) {
          const data = await response.json();
          let realCooks = [];
          
          if (Array.isArray(data)) realCooks = data;
          else if (data && Array.isArray(data.cooks)) realCooks = data.cooks;
          else if (data && Array.isArray(data.data)) realCooks = data.data;

          setProviders(realCooks);
        } else {
          throw new Error('Failed to fetch from server');
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to load kitchens right now. Please check your internet or try again later.");
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCooks();
  }, []);

  const filteredProviders = providers.filter(provider => {
    const kitchen = provider?.kitchenName || "";
    const cuisine = provider?.cuisine || "";
    
    const matchesSearch = 
      kitchen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCuisine = cuisineFilter === "All" ? true : cuisine.includes(cuisineFilter);
    
    return matchesSearch && matchesCuisine;
  });

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden shadow-lg flex flex-col h-[420px] animate-pulse">
          <div className="h-56 w-full bg-[#1E293B]"></div>
          <div className="p-6 flex flex-col flex-1 justify-between">
            <div>
              <div className="h-7 w-3/4 bg-[#1E293B] rounded-lg mb-3"></div>
              <div className="h-4 w-1/2 bg-[#1E293B] rounded mb-6"></div>
            </div>
            <div className="h-12 w-full bg-[#1E293B] rounded-xl mt-6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20 relative overflow-hidden">
      
      {/* 🌟 Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F4B942]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Active Kitchens in your area</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] mb-4">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981]">Homemade Tiffins</span>
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-2xl font-medium">
              Browse through verified home cooks. Prepared with love, hygiene, and the finest local ingredients.
            </p>
          </div>
          
          {!loading && !error && (
             <div className="bg-[#111827]/80 backdrop-blur-md border border-[#263241] px-6 py-4 rounded-2xl text-sm font-bold text-[#94A3B8] shadow-xl whitespace-nowrap flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] text-xl">🍲</div>
               <div>
                 <p className="text-xs uppercase tracking-wider text-[#64748B] mb-0.5">Total Available</p>
                 <p className="text-[#F8FAFC] text-lg"><span className="text-[#10B981] text-xl">{filteredProviders.length}</span> Kitchens</p>
               </div>
             </div>
          )}
        </div>

        {/* 🔍 Sticky Search & Filter Bar */}
        <div className="bg-[#111827]/80 backdrop-blur-2xl p-5 rounded-3xl border border-[#263241] shadow-[0_20px_40px_rgba(0,0,0,0.4)] mb-14 sticky top-24 z-40 transition-all">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#10B981]">
                <svg className="h-5 w-5 text-[#64748B] group-focus-within:text-[#10B981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search by kitchen name or favorite cuisine..." 
                className="w-full pl-12 pr-4 py-4 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm font-medium transition-all shadow-inner" 
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#263241]/50">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2 hidden sm:block flex-shrink-0">Filter By Cuisine:</span>
            {cuisines.map((cuisine) => (
              <button 
                key={cuisine} 
                onClick={() => setCuisineFilter(cuisine)} 
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  cuisineFilter === cuisine 
                    ? "bg-[#10B981] text-[#080D12] shadow-[0_0_20px_rgba(16,185,129,0.4)] transform scale-105" 
                    : "bg-[#080D12] border border-[#263241] text-[#94A3B8] hover:border-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1E293B]"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {loading && <SkeletonLoader />}

        {error && (
          <div className="w-full text-center py-20 bg-rose-500/5 border border-rose-500/20 rounded-3xl max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <span className="text-6xl block mb-6 animate-bounce">🔌</span>
            <h3 className="text-2xl font-black text-rose-500 mb-3">Backend Connection Error</h3>
            <p className="text-[#94A3B8] text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3.5 bg-[#111827] border border-[#263241] text-[#F8FAFC] font-black rounded-xl hover:bg-[#1E293B] hover:text-[#10B981] transition-all">
              Refresh Page Now
            </button>
          </div>
        )}

        {/* 🏪 Real Kitchens Grid */}
        {!loading && !error && (
          <>
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProviders.map((provider) => (
                  <div key={provider._id} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden group flex flex-col hover:border-[#10B981]/50 hover:shadow-[0_15px_50px_rgba(16,185,129,0.15)] transition-all duration-500 transform hover:-translate-y-2 relative">
                    
                    {/* Image Section */}
                    <div className="relative h-56 w-full bg-[#1E293B] overflow-hidden">
                      <img 
                        src={getKitchenImage(provider)} 
                        alt={provider.kitchenName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-[#080D12]/90 backdrop-blur-md border border-[#F4B942]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,185,66,0.3)]">
                        <span className="text-[#F4B942] text-sm">⭐</span>
                        <span className="text-[#F8FAFC] text-sm font-black">{provider.rating || '4.8'}</span>
                      </div>
                    </div>

                    <div className="p-7 relative -mt-6 flex flex-col flex-1 bg-[#111827] rounded-t-[32px] border-t border-[#263241]/50 z-10">
                      <h3 className="text-2xl font-black text-[#F8FAFC] line-clamp-1 group-hover:text-[#10B981] transition-colors">{provider.kitchenName || 'Chef Kitchen'}</h3>
                      
                      <p className="text-[#94A3B8] text-sm mb-5 font-semibold mt-2 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center text-xs">👨‍🍳</span>
                        by {provider.user?.name || 'Home Chef'} • {provider.cuisine || 'Multi-Cuisine'}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-8 flex-wrap">
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          FSSAI Verified
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/20 flex items-center gap-1">
                          Daily Fresh
                        </span>
                      </div>

                      <div className="mt-auto pt-2">
                        <Link 
                          to={`/provider/${provider.user?._id || provider._id}`} 
                          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#080D12] text-[#F8FAFC] text-sm font-black rounded-2xl border border-[#263241] group-hover:bg-[#10B981] group-hover:text-[#080D12] group-hover:border-[#10B981] transition-all duration-300 shadow-md"
                        >
                          Explore Kitchen Menu
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              // ❌ EMPTY STATE (No CTA Button)
              <div className="w-full text-center py-24 bg-[#111827] border border-[#263241] rounded-3xl mt-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <span className="text-5xl opacity-80 block mb-6">🍽️</span>
                <h3 className="text-3xl font-black text-[#F8FAFC]">No Kitchens Found</h3>
                
                {searchTerm || cuisineFilter !== "All" ? (
                  <>
                    <p className="text-[#94A3B8] mt-4 text-lg mb-8 max-w-xl mx-auto">
                      No kitchens match your current search or filters. Try clearing them.
                    </p>
                    <button onClick={() => {setSearchTerm(""); setCuisineFilter("All");}} className="px-8 py-3.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 font-bold rounded-xl hover:bg-[#10B981] hover:text-[#080D12] transition-colors relative z-10">
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <p className="text-[#94A3B8] mt-4 text-lg mb-8 max-w-xl mx-auto">
                    We are currently expanding our services in your area. Real, authentic home kitchens will be added here soon. Stay tuned!
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;