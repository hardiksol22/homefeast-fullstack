import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🟢 useNavigate add kiya
import { useAuth } from '../context/AuthContext'; // 🟢 useAuth import kiya (Path check kar lena agar alag folder mein ho)

const CustomerDashboard = () => {
  const navigate = useNavigate(); // 🟢 Navigation ke liye
  const { user } = useAuth(); // 🟢 Logged-in user ka data
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dietFilter, setDietFilter] = useState("All"); 
  
  const [greeting, setGreeting] = useState("");
  const [moodSuggestion, setMoodSuggestion] = useState("");
  const [smartFilter, setSmartFilter] = useState("All");

  // 🟢 NAYA SECURITY LOGIC: Agar Cook hai, toh usko Cook Dashboard bhej do!
  useEffect(() => {
    const userRole = user?.role || user?.user?.role;
    if (userRole === 'cook') {
      navigate('/cook-dashboard');
    }
  }, [user, navigate]);

  const dietOptions = ["All", "Veg", "Non-Veg"];

  const getKitchenImage = (provider) => {
    if (provider.image && provider.image.length > 10) return provider.image;
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
  };

  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Chef')}&background=10B981&color=080D12&size=150&bold=true`;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) {
      setGreeting("Good Morning! ☀️");
      setMoodSuggestion("Start your day with fresh homemade breakfast.");
    } else if (hour < 16) {
      setGreeting("Good Afternoon! 🍛");
      setMoodSuggestion("Lunchtime! Find the perfect home-cooked meal.");
    } else if (hour < 21) {
      setGreeting("Good Evening! 🍽️");
      setMoodSuggestion("Let's get your perfect dinner sorted.");
    } else {
      setGreeting("Late Night Cravings? 🌙");
      setMoodSuggestion("Midnight hunger? We've got you covered.");
    }
  }, []);

  useEffect(() => {
    const fetchCooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        if (response.ok) {
          const data = await response.json();
          let realCooks = Array.isArray(data) ? data : (data.cooks || data.data || []);
          setProviders(realCooks);
        } else throw new Error('Fetch failed');
      } catch (err) {
        setError("Unable to connect to HomeFeast Servers.");
      } finally {
        setLoading(false);
      }
    };
    fetchCooks();
  }, []);

  const filteredProviders = providers.filter(provider => {
    const kitchen = provider?.kitchenName || "";
    const cuisine = provider?.cuisine || "";
    const type = provider?.type || provider?.cuisine || ""; 

    const matchesSearch = kitchen.toLowerCase().includes(searchTerm.toLowerCase()) || cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiet = dietFilter === "All" ? true : type.includes(dietFilter);
    
    let matchesSmart = true;
    if (smartFilter === "Top Rated") matchesSmart = parseFloat(provider.rating || 0) >= 4.7;
    if (smartFilter === "Fast Delivery") matchesSmart = parseFloat(provider.rating || 0) >= 4.0; 

    return matchesSearch && matchesDiet && matchesSmart;
  });

  const aiPicks = [...providers].sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)).slice(0, 3);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-[#111827] border border-[#263241] rounded-[32px] animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Smart Search */}
        <div className="mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-4 backdrop-blur-md">
            <span className="text-xl">👋</span>
            <span className="text-sm font-black text-[#10B981] tracking-widest">{greeting}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
            What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#F4B942]">craving</span> today?
          </h1>
          <p className="text-[#94A3B8] text-lg font-medium">{moodSuggestion}</p>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-3xl p-5 rounded-[28px] border border-[#263241] shadow-2xl mb-12 sticky top-24 z-40">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#10B981]">🔍</div>
              <input 
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search kitchens or chefs..." 
                className="w-full pl-14 pr-6 py-4 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] focus:outline-none focus:border-[#10B981] font-semibold transition-all shadow-inner" 
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar items-center">
              {["All", "Top Rated", "Fast Delivery"].map(filter => (
                <button 
                  key={filter} onClick={() => setSmartFilter(filter)}
                  className={`px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                    smartFilter === filter ? "bg-[#F8FAFC] text-[#080D12]" : "bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {filter === "Top Rated" ? "⭐ " : filter === "Fast Delivery" ? "⚡ " : ""}{filter}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dietary Preference Filters */}
          <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar pt-4 border-t border-[#263241]/50 items-center">
            <span className="text-xs font-black text-[#64748B] uppercase tracking-widest mr-2 hidden sm:block flex-shrink-0">Preference:</span>
            {dietOptions.map(diet => (
              <button 
                key={diet} onClick={() => setDietFilter(diet)} 
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  dietFilter === diet 
                  ? diet === 'Veg' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : diet === 'Non-Veg' ? 'bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-[#F8FAFC]/10 text-[#F8FAFC] border border-[#F8FAFC]/50'
                  : "bg-[#080D12] text-[#64748B] border border-[#263241] hover:border-[#64748B] hover:text-[#F8FAFC]"
                }`}
              >
                {diet === 'Veg' && <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>}
                {diet === 'Non-Veg' && <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>}
                {diet === 'All' && <span className="text-sm">🍽️</span>}
                {diet}
              </button>
            ))}
          </div>
        </div>

        {loading ? <SkeletonLoader /> : error ? (
           <div className="text-center py-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl"><h3 className="text-2xl text-rose-500">{error}</h3></div>
        ) : (
          <>
            {/* AI SMART PICKS */}
            {!searchTerm && dietFilter === "All" && smartFilter === "All" && aiPicks.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <span className="bg-[#1E293B] p-2 rounded-lg text-xl">✨</span> AI Smart Picks For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiPicks.map(provider => (
                    <Link key={`ai-${provider._id}`} to={`/provider/${provider._id}`} className="block group">
                      <div className="bg-[#111827] border border-[#263241] rounded-[24px] p-4 flex gap-4 hover:border-[#10B981]/50 hover:bg-[#1E293B]/50 transition-all shadow-lg items-center">
                        <div className="relative">
                          <img src={getAvatar(provider.user?.name || provider.kitchenName)} className="w-16 h-16 rounded-full border-2 border-[#10B981] object-cover" alt="Chef Avatar" />
                          <div className="absolute -bottom-1 -right-1 bg-[#080D12] text-[10px] w-6 h-6 flex items-center justify-center rounded-full border border-[#263241]">👨‍🍳</div>
                        </div>
                        <div className="flex-1 py-1">
                          <h4 className="font-black text-[#F8FAFC] text-lg leading-tight group-hover:text-[#10B981]">{provider.kitchenName}</h4>
                          <p className="text-xs text-[#94A3B8] font-bold mt-1">Lead Chef: {provider.user?.name}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* EXPLORE KITCHENS GRID */}
            <h2 className="text-2xl font-black mb-6 border-b border-[#263241] pb-4 flex items-center justify-between">
              <span>👨‍🍳 Explore Kitchens & Chef Teams</span>
            </h2>
            
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                {filteredProviders.map((provider) => {
                  const chefTeamCount = provider.chefsCount || 2; 

                  return (
                    <div key={provider._id} className="bg-[#111827] border border-[#263241] rounded-[32px] overflow-visible group flex flex-col hover:border-[#10B981]/40 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-500 transform hover:-translate-y-2 h-full mt-6">
                      
                      {/* Kitchen Cover Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-t-[32px]">
                        <img src={getKitchenImage(provider)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="Kitchen Cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-[#080D12]/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg font-black text-sm text-[#F8FAFC]">⭐ {provider.rating || '4.8'}</div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 bg-[#080D12] rounded-b-[32px] relative pt-12">
                        
                        {/* Chef Avatar Overlapping */}
                        <div className="absolute -top-10 left-6 z-20">
                          <div className="relative group-hover:-translate-y-2 transition-transform duration-300">
                             <img 
                               src={getAvatar(provider.user?.name || provider.kitchenName)} 
                               className="w-20 h-20 rounded-full border-4 border-[#080D12] shadow-xl object-cover" 
                               alt="Chef Avatar" 
                             />
                             <div className="absolute bottom-0 right-0 bg-[#10B981] w-5 h-5 rounded-full border-2 border-[#080D12] shadow-sm"></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-xl font-black text-[#F8FAFC] line-clamp-1 group-hover:text-[#10B981] transition-colors">{provider.kitchenName}</h3>
                            <p className="text-[#10B981] text-sm font-black mt-1">Lead Chef: {provider.user?.name || 'Partner'}</p>
                          </div>
                        </div>
                        
                        {/* Chef Team Count Badge */}
                        <div className="my-2.5 inline-flex items-center gap-2 bg-[#1E293B] border border-[#263241] px-3 py-1 rounded-xl w-fit">
                          <span className="text-xs">👥</span>
                          <span className="text-xs font-bold text-[#94A3B8]">Chef Team: <strong className="text-[#F8FAFC]">{chefTeamCount} Active Chefs</strong></span>
                        </div>
                        
                        <p className="text-[#64748B] text-xs font-bold mb-4">{provider.cuisine} • Freshly Prepared</p>
                        
                        <div className="mt-auto pt-4 border-t border-[#263241]">
                          <Link to={`/provider/${provider._id}`} className="w-full block text-center py-3.5 bg-[#111827] text-[#F8FAFC] text-sm font-black rounded-xl border border-[#263241] group-hover:bg-[#10B981] group-hover:text-[#080D12] transition-all shadow-md">
                            Visit Kitchen & Chefs →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full text-center py-20 bg-[#111827] border border-[#263241] rounded-[32px]">
                <h3 className="text-2xl font-black text-[#F8FAFC]">No matching kitchens found.</h3>
                <button onClick={() => {setSearchTerm(""); setDietFilter("All"); setSmartFilter("All");}} className="mt-4 px-6 py-3 bg-[#10B981]/20 text-[#10B981] rounded-xl font-bold">Clear Filters</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;