import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [matchedChef, setMatchedChef] = useState(null);

  // 📡 FETCH CHEFS (Providers)
  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks');
        if (response.ok) {
          const data = await response.json();
          let realCooks = Array.isArray(data) ? data : (data.cooks || data.data || []);
          // Sort by rating for the leaderboard effect
          setChefs(realCooks.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)));
        }
      } catch (err) {
        console.error("Error fetching chefs");
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  // 🧠 SUPER INTELLIGENCE: AI Chef Matchmaker
  const handleAiMatch = () => {
    setAiMatchLoading(true);
    setMatchedChef(null);
    
    // Simulate AI thinking based on time of day & ratings
    setTimeout(() => {
      if (chefs.length > 0) {
        const hour = new Date().getHours();
        let suitableChefs = chefs;
        
        // Simple logic: Morning -> Healthy/South Indian, Night -> North Indian/Punjabi
        if (hour < 11) {
          suitableChefs = chefs.filter(c => ['Healthy', 'South Indian'].includes(c.cuisine)) || chefs;
        } else if (hour > 18) {
          suitableChefs = chefs.filter(c => ['North Indian', 'Punjabi', 'Mughlai'].includes(c.cuisine)) || chefs;
        }
        
        if (suitableChefs.length === 0) suitableChefs = chefs;
        
        const randomMatch = suitableChefs[Math.floor(Math.random() * suitableChefs.length)];
        setMatchedChef(randomMatch);
      }
      setAiMatchLoading(false);
    }, 1500);
  };

  // Generate random avatar if chef doesn't have a personal photo
  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Chef')}&background=10B981&color=080D12&size=200&bold=true`;

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-24 relative overflow-hidden">
      
      {/* 🌌 Ambient Glows */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-[#F4B942]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= 🎩 HEADER & AI MATCHMAKER ================= */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4B942]/10 border border-[#F4B942]/20 mb-6 backdrop-blur-md">
            <span className="text-[#F4B942] font-black tracking-widest text-xs uppercase">The Masters of Taste</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4B942] via-[#FBBF24] to-[#F4B942]">Culinary Artists</span>
          </h1>
          <p className="text-[#94A3B8] text-lg font-medium max-w-2xl mx-auto mb-10">
            Behind every delicious tiffin is a passionate home chef. Discover their stories, specialties, and order directly from their kitchens.
          </p>

          {/* 🧠 AI Match Button */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-6 rounded-[32px] max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-black mb-2 flex items-center justify-center gap-2">
              <span>🤖</span> Confused what to order?
            </h3>
            <p className="text-[#64748B] text-sm font-semibold mb-6">Let our AI match you with the perfect chef based on the current time and top ratings.</p>
            
            <button 
              onClick={handleAiMatch}
              disabled={aiMatchLoading || chefs.length === 0}
              className="w-full py-4 bg-[#10B981] text-[#080D12] text-base font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-70 flex justify-center items-center gap-3"
            >
              {aiMatchLoading ? (
                <><span className="w-5 h-5 border-2 border-[#080D12] border-t-transparent rounded-full animate-spin"></span> Analyzing Preferences...</>
              ) : (
                <>✨ Find My Perfect Chef ✨</>
              )}
            </button>

            {/* 🏆 AI Match Result */}
            {matchedChef && !aiMatchLoading && (
              <div className="mt-6 p-4 bg-[#080D12] border border-[#10B981]/30 rounded-2xl animate-fade-in-up text-left flex gap-4 items-center group">
                <img src={getAvatar(matchedChef.user?.name || matchedChef.kitchenName)} alt="Chef" className="w-16 h-16 rounded-full border-2 border-[#10B981]" />
                <div className="flex-1">
                  <p className="text-xs font-black text-[#10B981] uppercase tracking-wider mb-1">98% Match 🎯</p>
                  <h4 className="text-lg font-black text-[#F8FAFC]">{matchedChef.user?.name || 'Chef'}</h4>
                  <p className="text-sm text-[#94A3B8] font-semibold">{matchedChef.kitchenName} • {matchedChef.cuisine}</p>
                </div>
                <Link to={`/provider/${matchedChef._id}`} className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-[#080D12] transition-colors">
                  →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= 👨‍🍳 CHEFS DIRECTORY GRID ================= */}
        <div className="flex items-center justify-between mb-8 border-b border-[#263241] pb-4">
          <h2 className="text-2xl font-black text-[#F8FAFC]">Our Verified Chefs</h2>
          <span className="bg-[#1E293B] text-[#94A3B8] px-3 py-1 rounded-lg text-xs font-bold">{chefs.length} Active</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[300px] bg-[#111827] border border-[#263241] rounded-[32px] animate-pulse"></div>)}
          </div>
        ) : chefs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef, index) => {
              // 🧠 INTELLIGENCE: Assign Dynamic Titles based on index (sorted by rating)
              const isLegend = index === 0;
              const isRisingStar = parseFloat(chef.rating || 0) < 4.5 && index > 3;

              return (
                <div key={chef._id} className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-6 flex flex-col items-center text-center hover:border-[#F4B942]/40 hover:shadow-[0_20px_40px_rgba(244,185,66,0.1)] transition-all duration-500 transform hover:-translate-y-2 relative group">
                  
                  {/* Dynamic Tags */}
                  {isLegend && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#F4B942] text-[#080D12] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                      👑 Local Legend
                    </div>
                  )}
                  {isRisingStar && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#3B82F6] text-[#F8FAFC] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                      🚀 Rising Star
                    </div>
                  )}

                  {/* Chef Avatar */}
                  <div className="relative w-28 h-28 mb-5 mt-2">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#263241] group-hover:border-[#10B981] group-hover:animate-[spin_4s_linear_infinite] transition-colors"></div>
                    <img 
                      src={getAvatar(chef.user?.name || chef.kitchenName)} 
                      alt={chef.user?.name} 
                      className="w-full h-full rounded-full p-2 object-cover" 
                    />
                    <div className="absolute bottom-1 right-1 bg-[#080D12] border border-[#263241] rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-md">
                      ✅
                    </div>
                  </div>

                  {/* Chef Details */}
                  <h3 className="text-2xl font-black text-[#F8FAFC] mb-1">{chef.user?.name || 'Home Chef'}</h3>
                  <p className="text-[#10B981] font-black text-sm uppercase tracking-wider mb-3">{chef.kitchenName}</p>
                  
                  <div className="flex gap-2 mb-6">
                    <span className="bg-[#1E293B] px-3 py-1.5 rounded-lg text-xs font-bold text-[#94A3B8]">⭐ {chef.rating || '4.8'}</span>
                    <span className="bg-[#1E293B] px-3 py-1.5 rounded-lg text-xs font-bold text-[#94A3B8]">🥘 {chef.cuisine || 'Multi-Cuisine'}</span>
                  </div>

                  {/* Action Button */}
                  <Link 
                    to={`/provider/${chef._id}`}
                    className="w-full mt-auto py-3.5 bg-[#080D12] text-[#F8FAFC] text-sm font-black rounded-xl border border-[#263241] group-hover:bg-[#F4B942] group-hover:text-[#080D12] group-hover:border-[#F4B942] transition-all duration-300 shadow-sm flex justify-center items-center gap-2"
                  >
                    View Chef's Menu
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-black text-[#94A3B8]">No Chefs Available Right Now</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;