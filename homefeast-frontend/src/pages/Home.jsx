import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  // 🌟 Dynamic Text Animation Logic
  const words = ["Love", "Hygiene", "Authenticity", "Culture"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#080D12] text-[#F8FAFC] overflow-hidden selection:bg-[#10B981] selection:text-[#080D12]">
      
      {/* 🌌 Animated Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#10B981]/20 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-[#F4B942]/15 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-[#3B82F6]/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* ================= 🚀 HERO SECTION ================= */}
      <section className="relative w-full pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
        
        {/* Left Content */}
        <div className="flex-1 w-full min-w-0 text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-[#263241] shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-6 hover:border-[#10B981]/50 transition-colors cursor-default">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping relative">
               <span className="absolute inset-0 rounded-full bg-[#10B981]"></span>
            </span>
            <span className="text-xs font-black text-[#94A3B8] uppercase tracking-widest">100% Verified Home Chefs</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
            Taste the <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] transition-all duration-500">
              {words[currentWord]}
            </span> 
            <br />
            of Home.
          </h1>
          
          <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            HomeFeast connects you with passionate local home chefs. Order fresh, hygienic, and authentic homemade meals delivered straight to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <Link to="/explore" className="w-full sm:w-auto px-8 py-4.5 bg-[#10B981] text-[#080D12] text-lg font-black rounded-2xl hover:bg-[#059669] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1.5 flex justify-center items-center gap-3">
              Order Food Now 🍲
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4.5 bg-[#111827]/80 backdrop-blur-md text-[#F8FAFC] text-lg font-black rounded-2xl border border-[#263241] hover:border-[#10B981] hover:bg-[#10B981]/10 hover:text-[#10B981] transition-all shadow-lg transform hover:-translate-y-1.5 flex justify-center items-center gap-3">
              Join as a Partner 👨‍🍳
            </Link>
          </div>
        </div>

        {/* Right Image/Graphics (Super Advanced Glassmorphism) */}
        <div className="flex-1 relative w-full min-w-0 max-w-lg lg:max-w-full">
          {/* Main Floating Card */}
          <div className="relative rounded-[40px] overflow-hidden border-8 border-[#111827] shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform lg:rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105 z-10">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
              alt="Delicious Food" 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-transparent to-transparent opacity-60"></div>
          </div>

          {/* 🛸 Floating Badge 1 (Top Right) */}
          <div className="absolute -top-6 -right-6 lg:-right-10 bg-[#080D12]/90 backdrop-blur-xl border border-[#263241] px-5 py-3 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-[#F8FAFC] font-black text-lg leading-tight">4.9/5</p>
              <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest">User Rating</p>
            </div>
          </div>

          {/* 🛸 Floating Badge 2 (Bottom Left) */}
          <div className="absolute -bottom-8 -left-6 lg:-left-12 bg-[#080D12]/90 backdrop-blur-xl border border-[#263241] p-4 rounded-2xl flex items-center gap-4 shadow-[0_20px_40px_rgba(16,185,129,0.2)] z-20 hover:scale-110 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 flex items-center justify-center text-2xl">🛵</div>
            <div>
              <p className="text-[#10B981] text-xs font-black uppercase tracking-wider mb-0.5">Fast Delivery</p>
              <p className="text-[#F8FAFC] font-bold text-sm">Fresh to Table</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 🔄 INFINITE MARQUEE (Trending Categories) ================= */}
      <div className="w-full bg-[#111827] border-y border-[#263241] py-5 overflow-hidden flex relative z-20 shadow-xl">
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#111827] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#111827] to-transparent z-10"></div>
        
        <div className="flex space-x-12 whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
           {/* Items repeated for infinite scroll illusion */}
           {[1, 2].map((group) => (
             <div key={group} className="flex space-x-12 items-center">
                <span className="text-[#64748B] font-black text-xl uppercase tracking-widest flex items-center gap-2">🔥 North Indian</span>
                <span className="text-[#263241] text-2xl">•</span>
                <span className="text-[#64748B] font-black text-xl uppercase tracking-widest flex items-center gap-2">🥗 Healthy Keto</span>
                <span className="text-[#263241] text-2xl">•</span>
                <span className="text-[#64748B] font-black text-xl uppercase tracking-widest flex items-center gap-2">🥘 Authentic Bengali</span>
                <span className="text-[#263241] text-2xl">•</span>
                <span className="text-[#64748B] font-black text-xl uppercase tracking-widest flex items-center gap-2">🌶️ Spicy Punjabi</span>
                <span className="text-[#263241] text-2xl">•</span>
                <span className="text-[#64748B] font-black text-xl uppercase tracking-widest flex items-center gap-2">🥥 South Indian</span>
                <span className="text-[#263241] text-2xl">•</span>
             </div>
           ))}
        </div>
      </div>

      {/* ================= 🛠️ HOW IT WORKS SECTION ================= */}
      <section className="py-28 bg-[#080D12] w-full relative z-10 pb-40">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-5">How <span className="text-[#10B981]">HomeFeast</span> Works</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto font-medium">Three simple steps to enjoy the best homemade meals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line (Hidden on mobile) */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#10B981]/0 via-[#10B981]/20 to-[#10B981]/0 -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-10 rounded-[32px] text-center hover:border-[#10B981]/50 hover:bg-[#10B981]/5 transition-all duration-500 group transform hover:-translate-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10 relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#080D12] border border-[#263241] rounded-full flex items-center justify-center font-black text-[#64748B] group-hover:text-[#10B981] group-hover:border-[#10B981] transition-colors">01</div>
              <div className="w-24 h-24 mx-auto bg-[#080D12] border border-[#263241] rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:border-[#10B981]/30 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all">📱</div>
              <h3 className="text-2xl font-black text-[#F8FAFC] mb-4">Explore Kitchens</h3>
              <p className="text-[#94A3B8] font-medium leading-relaxed">Browse through hundreds of verified local home chefs and their daily menus.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-10 rounded-[32px] text-center hover:border-[#F4B942]/50 hover:bg-[#F4B942]/5 transition-all duration-500 group transform hover:-translate-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10 relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#080D12] border border-[#263241] rounded-full flex items-center justify-center font-black text-[#64748B] group-hover:text-[#F4B942] group-hover:border-[#F4B942] transition-colors">02</div>
              <div className="w-24 h-24 mx-auto bg-[#080D12] border border-[#263241] rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:border-[#F4B942]/30 group-hover:shadow-[0_0_30px_rgba(244,185,66,0.2)] transition-all">🥘</div>
              <h3 className="text-2xl font-black text-[#F8FAFC] mb-4">Choose Your Meal</h3>
              <p className="text-[#94A3B8] font-medium leading-relaxed">Select your favorite dishes, customize your tiffin, and place your order securely.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] p-10 rounded-[32px] text-center hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-all duration-500 group transform hover:-translate-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10 relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#080D12] border border-[#263241] rounded-full flex items-center justify-center font-black text-[#64748B] group-hover:text-[#3B82F6] group-hover:border-[#3B82F6] transition-colors">03</div>
              <div className="w-24 h-24 mx-auto bg-[#080D12] border border-[#263241] rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:border-[#3B82F6]/30 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all">🛵</div>
              <h3 className="text-2xl font-black text-[#F8FAFC] mb-4">Fast Delivery</h3>
              <p className="text-[#94A3B8] font-medium leading-relaxed">Enjoy hot, hygienic, and fresh home-cooked food delivered straight to your door.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;