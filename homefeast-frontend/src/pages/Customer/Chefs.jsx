import { Link } from 'react-router-dom';

const Chefs = () => {
  const featuredChefs = [
    { id: 1, name: "Aunty's Authentic", specialty: "Punjabi & North Indian", rating: 4.8, reviews: 124, img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Healthy Bites by Priya", specialty: "Keto & Salads", rating: 4.9, reviews: 89, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Maa Ka Pyaar", specialty: "Homestyle Daily Tiffin", rating: 4.7, reviews: 210, img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "South Indian Delights", specialty: "Dosa, Idli & Meals", rating: 4.6, reviews: 156, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Meet Our <span className="text-[#10B981]">Top Chefs</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Discover the passionate home cooks who bring authentic, hygienic, and delicious meals to your table every day.
          </p>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredChefs.map((chef) => (
            <div key={chef.id} className="group bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden hover:border-[#10B981]/50 transition-all duration-300 hover:-translate-y-2 shadow-lg text-center p-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img 
                  src={chef.img} 
                  alt={chef.name} 
                  className="w-full h-full object-cover rounded-full border-4 border-[#080D12] group-hover:border-[#10B981] transition-colors duration-300"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#F4B942] text-[#080D12] text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  ⭐ {chef.rating}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">{chef.name}</h3>
              <p className="text-[#94A3B8] text-sm mb-4">{chef.specialty}</p>
              
              <Link to="/customer" className="inline-block w-full py-2.5 bg-[#10B981]/10 text-[#10B981] text-sm font-bold rounded-xl hover:bg-[#10B981] hover:text-[#080D12] transition-colors">
                View Kitchen
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Chefs;