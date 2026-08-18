import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-[#080D12] text-[#F8FAFC] min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[#10B981]/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4B942]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-sm font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            Now delivering in 5+ Cities
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            Fresh, Homemade Meals <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">
              Delivered Daily.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified home cooks in your neighborhood. Subscribe to hygienic, affordable, and authentic tiffin services without any hassle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/customer" 
              className="w-full sm:w-auto px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Tiffins Near You
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[#111827] hover:bg-[#263241] text-[#F8FAFC] font-bold text-lg rounded-xl border border-[#263241] transition-all duration-300"
            >
              Partner as a Cook
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 bg-[#05080B] border-y border-[#263241]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC]">How HomeFeast Works</h2>
            <p className="text-[#94A3B8] mt-4">Three simple steps to your daily homemade feast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#080D12] border border-[#263241] hover:border-[#10B981]/50 transition-colors group">
              <div className="w-16 h-16 mx-auto bg-[#10B981]/10 text-[#10B981] flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">1. Discover Cooks</h3>
              <p className="text-[#94A3B8]">Browse verified home kitchens near you. Filter by Pure Veg, diet types, and delivery areas.</p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#080D12] border border-[#263241] hover:border-[#F4B942]/50 transition-colors group relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-16 -left-6 w-12 h-[2px] bg-[#263241]"></div>
              
              <div className="w-16 h-16 mx-auto bg-[#F4B942]/10 text-[#F4B942] flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">2. Choose a Plan</h3>
              <p className="text-[#94A3B8]">Select a daily, weekly, or monthly subscription plan that fits your budget and schedule.</p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#080D12] border border-[#263241] hover:border-[#F97316]/50 transition-colors group relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-16 -left-6 w-12 h-[2px] bg-[#263241]"></div>
              
              <div className="w-16 h-16 mx-auto bg-[#F97316]/10 text-[#F97316] flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">3. Enjoy Daily Meals</h3>
              <p className="text-[#94A3B8]">Get fresh, hot, and hygienic food delivered directly to your home or office desk every day.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;