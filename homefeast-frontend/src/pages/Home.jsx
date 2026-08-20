import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entry animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-[#080D12] text-[#F8FAFC] min-h-screen overflow-hidden selection:bg-[#10B981]/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Animated Background Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[120px] mix-blend-screen animate-blob pointer-events-none"></div>
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#F4B942]/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F97316]/10 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Typography & CTAs */}
            <div className={`flex flex-col justify-center text-center lg:text-left transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-[#263241] w-max mx-auto lg:mx-0 mb-8 shadow-lg hover:border-[#10B981]/50 transition-colors cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
                </span>
                <span className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest">
                  100% Verified Home Kitchens
                </span>
              </div>

              {/* Animated Gradient Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1] mb-6">
                The True Taste <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] animate-gradient-x drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  Of Home.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#94A3B8] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Skip the junk. Subscribe to fresh, hygienic, and authentic homemade tiffins prepared by passionate culinary artisans in your city.
              </p>

              {/* Premium Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <Link 
                  to="/customer" 
                  className="w-full sm:w-auto px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-[#080D12] text-base font-black rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Explore Tiffins
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link 
                  to="/cook" 
                  className="w-full sm:w-auto px-8 py-4 bg-[#111827]/50 backdrop-blur-md border border-[#263241] text-[#F8FAFC] hover:border-[#10B981] hover:bg-[#10B981]/10 text-base font-bold rounded-full transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  Partner as a Cook
                </Link>
              </div>

              {/* Micro-Stats */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-[#263241]/50">
                <div className="flex -space-x-3">
                  <img className="w-12 h-12 rounded-full border-2 border-[#080D12] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-12 h-12 rounded-full border-2 border-[#080D12] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-12 h-12 rounded-full border-2 border-[#080D12] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <div className="w-12 h-12 rounded-full border-2 border-[#080D12] bg-[#263241] flex items-center justify-center text-xs font-bold text-[#F8FAFC]">
                    10k+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#F4B942] text-sm mb-1">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Happy Foodies</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Hero Image & Floating Cards */}
            <div className={`relative hidden lg:block h-[600px] w-full transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              
              {/* Main Image Container */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-[#263241]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-all duration-700 ease-out z-10 group">
                <img 
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80" 
                  alt="Delicious Homemade Tiffin" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/20 to-transparent opacity-90"></div>
              </div>

              {/* Floating Glass Card 1 (Top Left) */}
              <div className="absolute top-16 -left-12 z-20 bg-[#111827]/80 backdrop-blur-xl border border-[#10B981]/30 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/30">
                    <span className="text-[#10B981] text-xl">🍲</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#F8FAFC]">Authentic Thali</h5>
                    <p className="text-xs text-[#10B981] font-bold mt-1 tracking-wide">Pure Veg Available</p>
                  </div>
                </div>
              </div>

              {/* Floating Glass Card 2 (Bottom Right) */}
              <div className="absolute bottom-28 -right-10 z-20 bg-[#111827]/80 backdrop-blur-xl border border-[#F4B942]/30 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float animation-delay-2000">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F4B942]/20 flex items-center justify-center border border-[#F4B942]/30">
                    <span className="text-[#F4B942] text-xl">⭐</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#F8FAFC]">Top Rated Chef</h5>
                    <p className="text-xs text-[#94A3B8] font-semibold mt-1">4.9/5 from 2k+ reviews</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Redesigned) --- */}
      <section className="py-24 bg-[#05080B] relative z-20 border-t border-[#263241]/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] mb-4">How It <span className="text-[#10B981]">Works</span></h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">Three simple steps to bring the authentic taste of home directly to your dining table.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Connectors (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#10B981]/50 via-[#F4B942]/50 to-[#F97316]/50 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#080D12] border-2 border-[#10B981] text-[#10B981] flex items-center justify-center rounded-3xl mb-8 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Discover</h3>
              <p className="text-[#94A3B8] px-4">Browse verified home kitchens near you. Filter by Pure Veg, Keto, and specific cuisines.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#080D12] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center rounded-3xl mb-8 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(244,185,66,0.3)] transition-all duration-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Subscribe</h3>
              <p className="text-[#94A3B8] px-4">Select a daily, weekly, or monthly subscription plan that perfectly fits your schedule.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 group">
              <div className="w-24 h-24 mx-auto bg-[#080D12] border-2 border-[#F97316] text-[#F97316] flex items-center justify-center rounded-3xl mb-8 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Enjoy</h3>
              <p className="text-[#94A3B8] px-4">Get fresh, hot, and hygienic food delivered directly to your desk or doorstep every day.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- CUSTOM CSS ANIMATIONS --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animate-float {
          animation: float 5s infinite ease-in-out;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

    </div>
  );
};

export default Home;