const Offers = () => {
  const promos = [
    { id: 1, title: "First Order Discount", code: "FEAST50", desc: "Get 50% off on your first daily tiffin trial (up to ₹100).", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/30" },
    { id: 2, title: "Monthly Plan Bonanza", code: "MONTH20", desc: "Save flat 20% when you subscribe to any 30-day meal plan.", color: "text-[#F4B942]", bg: "bg-[#F4B942]/10", border: "border-[#F4B942]/30" },
    { id: 3, title: "Weekend Special", code: "SUNDAYFREE", desc: "Buy 1 get 1 free on all special Sunday Thalis.", color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/30" },
  ];

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Exclusive <span className="text-[#F4B942]">Offers</span>
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Delicious meals shouldn't break the bank. Apply these promo codes at checkout for amazing discounts.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo) => (
            <div key={promo.id} className={`relative bg-[#111827] border-2 border-dashed ${promo.border} rounded-2xl p-6 overflow-hidden hover:scale-105 transition-transform duration-300`}>
              
              {/* Background Accent */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${promo.bg} blur-2xl`}></div>
              
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{promo.title}</h3>
              <p className="text-[#94A3B8] text-sm mb-6">{promo.desc}</p>
              
              <div className="flex items-center justify-between bg-[#080D12] border border-[#263241] rounded-xl p-2 pl-4">
                <span className={`font-black tracking-widest uppercase ${promo.color}`}>
                  {promo.code}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(promo.code);
                    alert(`Code ${promo.code} copied!`);
                  }}
                  className="px-4 py-2 bg-[#263241] hover:bg-[#334155] text-[#E5E7EB] text-xs font-bold rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Offers;