import { Link } from 'react-router-dom';

const Categories = () => {
  const categoryList = [
    { id: 1, name: "Pure Veg", icon: "🥬", desc: "100% vegetarian, sattvic homecooked meals.", color: "from-green-500/20 to-green-900/20" },
    { id: 2, name: "Non-Veg Delights", icon: "🍗", desc: "Rich and authentic non-vegetarian curries.", color: "from-rose-500/20 to-rose-900/20" },
    { id: 3, name: "Healthy Keto", icon: "🥗", desc: "Low carb, high protein meals for fitness.", color: "from-[#10B981]/20 to-[#080D12]" },
    { id: 4, name: "Daily Tiffin", icon: "🍱", desc: "Everyday staple food for students & pros.", color: "from-blue-500/20 to-blue-900/20" },
    { id: 5, name: "South Indian", icon: "🥥", desc: "Authentic idli, dosa, and traditional meals.", color: "from-[#F4B942]/20 to-[#F97316]/20" },
    { id: 6, name: "Sweet Cravings", icon: "🍮", desc: "Homemade desserts and festive sweets.", color: "from-purple-500/20 to-purple-900/20" }
  ];

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Explore by <span className="text-[#10B981]">Categories</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Find exactly what your taste buds are craving. From healthy salads to authentic regional thalis.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((cat) => (
            <Link 
              key={cat.id} 
              to="/customer" // Abhi ke liye wapas discovery page par bhej rahe hain
              className={`group relative bg-gradient-to-br ${cat.color} bg-[#111827] border border-[#263241] p-8 rounded-3xl hover:border-[#10B981]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#10B981]/10 transition-colors"></div>
              
              <div className="relative z-10">
                <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform origin-left">{cat.icon}</span>
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">{cat.name}</h3>
                <p className="text-[#94A3B8] text-sm">{cat.desc}</p>
                
                <div className="mt-6 flex items-center text-sm font-bold text-[#10B981] group-hover:text-[#F4B942] transition-colors">
                  View Tiffins 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Categories;