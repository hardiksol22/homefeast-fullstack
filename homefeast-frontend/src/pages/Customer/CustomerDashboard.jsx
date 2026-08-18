import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = ["All", "Pure Veg", "Non-Veg", "Daily Tiffin", "Weekly Plan", "Monthly Plan"];

const CustomerDashboard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Real Data States
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real cooks from Node.js Backend
  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cooks');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCooks();
  }, []);

  // Filter logic (Added fallbacks in case tags don't exist yet in DB)
  const filteredProviders = providers.filter(provider => {
    const providerTags = provider.tags || ["Daily Tiffin", "Pure Veg"]; // Fallback for now
    return activeCategory === "All" ? true : providerTags.includes(activeCategory);
  });

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#F8FAFC] mb-2">
            Discover <span className="text-[#10B981]">Homemade Tiffins</span> Near You
          </h1>
          <p className="text-[#94A3B8] text-sm md:text-base max-w-2xl">
            Browse through verified home cooks. Filter by your dietary preferences, subscribe to a plan, and enjoy daily hygienic meals.
          </p>
        </div>

        {/* Top Control Bar: Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-10 bg-[#111827] p-4 md:p-5 rounded-2xl border border-[#263241] shadow-sm">
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ease-out border ${
                  activeCategory === category
                    ? "bg-[#10B981] border-[#10B981] text-[#080D12] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "bg-[#080D12] border-[#263241] text-[#94A3B8] hover:border-[#10B981] hover:text-[#10B981]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter your area..."
                className="block w-full pl-9 pr-4 py-2.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] sm:text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10B981]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-rose-500 font-bold bg-rose-500/10 rounded-2xl border border-rose-500/20">
            {error} - Make sure your backend server is running!
          </div>
        )}

        {/* Tiffin Providers Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProviders.map((provider) => (
              <div 
                key={provider._id} 
                className="group bg-[#111827] border border-[#263241] rounded-2xl overflow-hidden hover:border-[#10B981]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#263241]">
                  {/* Using a placeholder image since we don't have image uploads yet */}
                  <img 
                    src={provider.image || "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80"} 
                    alt={provider.kitchenName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-90"></div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#F8FAFC] line-clamp-1">{provider.kitchenName}</h3>
                    <div className="flex items-center gap-1 bg-[#080D12] px-2 py-1 rounded-lg border border-[#263241]">
                      <svg className="w-3.5 h-3.5 text-[#F4B942]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-[#F8FAFC]">{provider.rating || 'New'}</span>
                    </div>
                  </div>
                  
                  <p className="text-[#94A3B8] text-sm mb-4 line-clamp-1">{provider.cuisine || 'Homecooked Meals'}</p>
                  
                  <div className="mt-auto pt-4 border-t border-[#263241] flex items-center justify-between">
                    <Link to={`/provider/${provider.user._id}`} className="w-full text-center px-4 py-2 bg-[#10B981]/10 text-[#10B981] text-sm font-bold rounded-lg border border-[#10B981]/30 hover:bg-[#10B981] hover:text-[#080D12] transition-colors">
                      View Kitchen
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Fallback (If database has no approved cooks yet) */}
        {!loading && !error && filteredProviders.length === 0 && (
          <div className="text-center py-20 bg-[#111827] border border-[#263241] rounded-2xl">
            <svg className="w-16 h-16 text-[#64748B] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-[#F8FAFC]">No Cooks Found!</h3>
            <p className="text-[#94A3B8] mt-2">Your database is currently empty or no cooks are approved yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;