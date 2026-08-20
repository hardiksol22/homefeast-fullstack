import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");

  const cuisines = ["All", "North Indian", "South Indian", "Healthy", "Punjabi", "Keto", "Maharashtrian", "Bengali"];

  useEffect(() => {
    const fetchCooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        
        if (!response.ok) {
          throw new Error('Failed to fetch from server');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProviders(data);
        } else {
          setProviders([]);
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
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden shadow-lg flex flex-col h-[400px] animate-pulse">
          <div className="h-52 w-full bg-[#1E293B]"></div>
          <div className="p-6 flex flex-col flex-1 justify-between">
            <div>
              <div className="h-6 w-3/4 bg-[#1E293B] rounded-lg mb-3"></div>
              <div className="h-4 w-1/2 bg-[#1E293B] rounded mb-4"></div>
            </div>
            <div className="h-12 w-full bg-[#1E293B] rounded-xl mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Live Kitchens</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-3">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">Homemade Tiffins</span>
            </h1>
            <p className="text-[#94A3B8] text-base max-w-2xl">
              Browse through verified home cooks in your area. Prepared with love, hygiene, and the finest ingredients.
            </p>
          </div>
          
          {!loading && !error && (
             <div className="bg-[#111827] border border-[#263241] px-5 py-3 rounded-2xl text-sm font-bold text-[#94A3B8] shadow-lg whitespace-nowrap">
               Showing <span className="text-[#10B981] text-lg">{filteredProviders.length}</span> active kitchens
             </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#111827]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#263241] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-12 sticky top-24 z-30 transition-all">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search by kitchen name or cuisine..." 
              className="w-full pl-12 pr-4 py-4 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm font-medium transition-all" 
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#263241]/50">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2 hidden sm:block">Filter Cuisines:</span>
            {cuisines.map((cuisine) => (
              <button 
                key={cuisine} 
                onClick={() => setCuisineFilter(cuisine)} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  cuisineFilter === cuisine 
                    ? "bg-[#10B981] text-[#080D12] shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    : "bg-[#080D12] border border-[#263241] text-[#94A3B8] hover:border-[#64748B] hover:text-[#F8FAFC]"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {loading && <SkeletonLoader />}

        {error && (
          <div className="w-full text-center py-16 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
            <span className="text-5xl block mb-4">🔌</span>
            <h3 className="text-xl font-bold text-rose-500 mb-2">Backend Connection Error</h3>
            <p className="text-[#94A3B8]">{error}</p>
            <p className="text-xs text-[#64748B] mt-4">(Note: Free Render servers spin down after inactivity. Give it 30-50 seconds and refresh.)</p>
            <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-[#111827] border border-[#263241] text-[#F8FAFC] font-bold rounded-xl hover:bg-[#263241] transition-colors">
              Refresh Page
            </button>
          </div>
        )}

        {/* Real Data Grid */}
        {!loading && !error && (
          <>
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProviders.map((provider) => (
                  <div key={provider._id} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden group flex flex-col hover:border-[#10B981]/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.12)] transition-all duration-300 transform hover:-translate-y-1">
                    
                    <div className="relative h-52 w-full bg-[#1E293B] overflow-hidden">
                      <img 
                        src={provider.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"} 
                        alt={provider.kitchenName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-[#080D12]/80 backdrop-blur-md border border-[#F4B942]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <span className="text-[#F4B942] text-xs">⭐</span>
                        <span className="text-[#F8FAFC] text-xs font-bold">{provider.rating || 'New'}</span>
                      </div>
                    </div>

                    <div className="p-6 relative -mt-4 flex flex-col flex-1 bg-[#111827] rounded-t-3xl border-t border-[#263241]/50">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] line-clamp-1">{provider.kitchenName}</h3>
                      </div>
                      
                      <p className="text-[#94A3B8] text-sm mb-4 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        by {provider.user?.name || 'Chef'} • {provider.cuisine}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                          FSSAI Verified
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                          Home Delivery
                        </span>
                      </div>

                      <div className="mt-auto border-t border-[#263241] pt-5">
                        <Link 
                          to={`/provider/${provider.user?._id || provider._id}`} 
                          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#10B981] text-[#080D12] text-sm font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        >
                          View Menu & Order
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              // 🟢 YAHAN FIX KIYA HAI: Ab 'Register' ki jagah ek proper message aayega!
              <div className="w-full text-center py-24 bg-[#111827] border border-[#263241] rounded-3xl mt-4 shadow-xl">
                <span className="text-7xl block mb-6 opacity-80">🍽️</span>
                <h3 className="text-3xl font-black text-[#F8FAFC]">No Kitchens Found</h3>
                {searchTerm || cuisineFilter !== "All" ? (
                  <p className="text-[#94A3B8] mt-3 text-lg">No kitchens match your current filters. Try clearing the search or filters.</p>
                ) : (
                  <p className="text-[#94A3B8] mt-3 text-lg mb-8 max-w-xl mx-auto">
                    We are currently expanding our services in your area. New home kitchens and chefs will be added here very soon. Stay tuned!
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