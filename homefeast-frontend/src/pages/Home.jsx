import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] overflow-hidden selection:bg-[#10B981] selection:text-[#080D12]">
      
      {/* 🌟 Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-[#F4B942]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] border border-[#263241] shadow-lg mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">100% Home Cooked & Hygienic</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981]">Love</span> of<br />
            Home, Anywhere.
          </h1>
          
          <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            HomeFeast connects you with passionate local home chefs. Order fresh, hygienic, and authentic homemade meals delivered straight to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-[#10B981] text-[#080D12] text-lg font-black rounded-2xl hover:bg-[#059669] transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 flex justify-center items-center gap-2">
              Order Food Now 🍲
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#111827] text-[#F8FAFC] text-lg font-black rounded-2xl border border-[#263241] hover:border-[#10B981] hover:bg-[#1E293B] hover:text-[#10B981] transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2">
              Join as a Partner 👨‍🍳
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-[#263241] pt-8">
            <div>
              <p className="text-3xl font-black text-[#F8FAFC]">100+</p>
              <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider">Home Chefs</p>
            </div>
            <div className="w-[1px] h-10 bg-[#263241]"></div>
            <div>
              <p className="text-3xl font-black text-[#F8FAFC]">5k+</p>
              <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider">Happy Meals</p>
            </div>
            <div className="w-[1px] h-10 bg-[#263241]"></div>
            <div>
              <p className="text-3xl font-black text-[#F8FAFC]">4.9⭐</p>
              <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider">User Rating</p>
            </div>
          </div>
        </div>

        {/* Right Image/Graphics (Glassmorphism card) */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-fade-in-up">
          <div className="relative rounded-[40px] overflow-hidden border-8 border-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
              alt="Delicious Food" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
            />
            
            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#080D12]/80 backdrop-blur-xl border border-[#263241] p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-xl">🛵</div>
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Fast Delivery</p>
                <p className="text-[#F8FAFC] font-black text-sm sm:text-base">Fresh from Kitchen to Table</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="py-24 bg-[#111827] relative z-10 border-t border-[#263241] pb-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">How <span className="text-[#10B981]">HomeFeast</span> Works</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">Three simple steps to enjoy the best homemade meals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#080D12] border border-[#263241] p-8 rounded-3xl text-center hover:border-[#10B981]/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto bg-[#1E293B] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-[#10B981]/20 transition-colors shadow-lg">📱</div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">1. Explore Kitchens</h3>
              <p className="text-[#94A3B8]">Browse through hundreds of verified local home chefs and their daily menus.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-[#080D12] border border-[#263241] p-8 rounded-3xl text-center hover:border-[#F4B942]/50 hover:shadow-[0_10px_30px_rgba(244,185,66,0.1)] transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto bg-[#1E293B] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-[#F4B942]/20 transition-colors shadow-lg">🥘</div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">2. Choose Your Meal</h3>
              <p className="text-[#94A3B8]">Select your favorite dishes, customize your tiffin, and place your order securely.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-[#080D12] border border-[#263241] p-8 rounded-3xl text-center hover:border-[#3B82F6]/50 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] transition-all duration-300 group transform hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto bg-[#1E293B] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-[#3B82F6]/20 transition-colors shadow-lg">🛵</div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">3. Fast Delivery</h3>
              <p className="text-[#94A3B8]">Enjoy hot, hygienic, and fresh home-cooked food delivered straight to your door.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;