import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Advanced Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");

  // Filter Categories
  const specialties = ["All", "North Indian", "South Indian", "Healthy", "Punjabi", "Baking", "Maharashtrian", "Bengali"];

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🟢 REAL LIVE BACKEND URL
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        
        if (!response.ok) {
          throw new Error('Failed to fetch from server');
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Enhancing data with random experience for UI if backend doesn't have it yet
          const enrichedData = data.map(chef => ({
              ...chef,
              experience: chef.experience || Math.floor(Math.random() * 8) + 2
          }));
          setChefs(enrichedData);
        } else {
          setChefs([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to load chefs right now. Please check your internet or try again later.");
        setChefs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  // 🟢 ADVANCED FILTERING LOGIC
  const filteredChefs = chefs.filter(chef => {
    const name = chef.user?.name || "";
    const cuisine = chef.cuisine || "";
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSpecialty = specialtyFilter === "All" ? true : cuisine.toLowerCase().includes(specialtyFilter.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-[#111827] border border-[#263241] rounded-3xl p-6 flex flex-col items-center animate-pulse shadow-lg">
          <div className="w-32 h-32 rounded-full bg-[#1E293B] mb-5 border-4 border-[#263241]"></div>
          <div className="h-6 w-3/4 bg-[#1E293B] rounded-lg mb-3"></div>
          <div className="h-4 w-1/2 bg-[#1E293B] rounded mb-6"></div>
          <div className="flex gap-2 w-full mb-6 justify-center">
             <div className="h-6 w-16 bg-[#1E293B] rounded"></div>
             <div className="h-6 w-16 bg-[#1E293B] rounded"></div>
          </div>
          <div className="w-full h-11 bg-[#1E293B] rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20 relative overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="text-xl">👨‍🍳</span>
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">
              Meet The Culinary Artists
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-4">
            Our Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">Home Chefs</span>
          </h1>
          <p className="text-[#94A3B8] text-base max-w-2xl">
            Passionate home cooks bringing the authentic taste of homemade food straight to your table. 
            Prepared with love, hygiene, and the finest ingredients.
          </p>
        </div>

        {/* 🎛️ Advanced Sticky Search & Filter Bar */}
        <div className="bg-[#111827]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#263241] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-12 sticky top-24 z-30 transition-all max-w-4xl mx-auto">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search chef by name or specialty..." 
              className="w-full pl-12 pr-4 py-4 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm font-medium transition-all shadow-inner"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 border-t border-[#263241]/50">
            {specialties.map((specialty) => (
              <button 
                key={specialty} 
                onClick={() => setSpecialtyFilter(specialty)} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  specialtyFilter === specialty 
                    ? "bg-[#10B981] text-[#080D12] shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    : "bg-[#080D12] border border-[#263241] text-[#94A3B8] hover:border-[#64748B] hover:text-[#F8FAFC]"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {loading && <SkeletonLoader />}

        {error && (
          <div className="w-full text-center py-16 bg-rose-500/10 border border-rose-500/20 rounded-3xl max-w-3xl mx-auto shadow-xl">
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
            {filteredChefs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredChefs.map((chef) => (
                  <div key={chef._id} className="bg-[#111827] border border-[#263241] rounded-3xl p-6 flex flex-col items-center group hover:border-[#10B981]/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-2 relative">
                    
                    {/* Top Right Rating Badge */}
                    <div className="absolute top-4 right-4 bg-[#080D12]/80 backdrop-blur-md border border-[#F4B942]/30 px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                      <span className="text-[#F4B942] text-xs">⭐</span>
                      <span className="text-[#F8FAFC] text-xs font-bold">{chef.rating || '4.9'}</span>
                    </div>

                    {/* Circular Profile Picture with Glow Effect */}
                    <div className="relative w-32 h-32 mb-5">
                      <div className="absolute inset-0 rounded-full bg-[#10B981] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                      <img 
                        src={chef.image || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"} 
                        alt={chef.user?.name || "Chef"} 
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full shadow-lg border-4 border-[#1E293B] group-hover:border-[#10B981] transition-colors duration-300 relative z-10"
                      />
                    </div>

                    {/* Chef Details */}
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-1 text-center line-clamp-1">{chef.user?.name || 'Home Chef'}</h3>
                    <p className="text-[#10B981] text-sm font-semibold mb-4 text-center bg-[#10B981]/10 px-3 py-1 rounded-full">{chef.cuisine || 'Multi-Cuisine'}</p>
                    
                    <div className="flex gap-2 mb-6 w-full justify-center">
                      <span className="bg-[#263241] text-[#94A3B8] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {chef.experience} Yrs
                      </span>
                      <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Verified
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link 
                      to={`/provider/${chef.user?._id || chef._id}`} 
                      className="w-full text-center py-3 bg-[#080D12] border border-[#263241] text-[#F8FAFC] text-sm font-black rounded-xl group-hover:bg-[#10B981] group-hover:text-[#080D12] group-hover:border-[#10B981] transition-all duration-300 mt-auto shadow-md flex items-center justify-center gap-2"
                    >
                      Explore Kitchen
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              // 🟢 ADVANCED EMPTY STATE
              <div className="w-full text-center py-24 bg-[#111827] border border-[#263241] rounded-3xl max-w-3xl mx-auto shadow-xl">
                <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">👨‍🍳</span>
                </div>
                <h3 className="text-3xl font-black text-[#F8FAFC]">No Chefs Found</h3>
                {searchTerm || specialtyFilter !== "All" ? (
                   <p className="text-[#94A3B8] mt-3 text-lg max-w-md mx-auto">
                     We couldn't find any chefs matching your filters. Try clearing the search or selecting a different specialty.
                   </p>
                ) : (
                   <p className="text-[#94A3B8] mt-3 text-lg max-w-md mx-auto">
                     Our culinary artists are currently preparing to serve your area. Please check back again soon!
                   </p>
                )}
                {(searchTerm || specialtyFilter !== "All") && (
                  <button 
                    onClick={() => {setSearchTerm(""); setSpecialtyFilter("All");}} 
                    className="mt-6 px-6 py-2.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-bold rounded-xl hover:bg-[#10B981] hover:text-[#080D12] transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chefs;