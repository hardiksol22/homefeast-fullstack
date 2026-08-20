import { Link } from 'react-router-dom';

const Orders = () => {
  // Mock data for premium UI display
  const activeSubscriptions = [
    { id: "SUB-8829", cook: "Aunty's Authentic", plan: "Monthly (Veg)", status: "Active", nextDelivery: "Today, 1:00 PM", amount: "₹3,200" }
  ];

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
          My <span className="text-[#10B981]">Subscriptions</span>
        </h1>

        {activeSubscriptions.length > 0 ? (
          <div className="space-y-6">
            {activeSubscriptions.map(sub => (
              <div key={sub.id} className="bg-[#111827] border border-[#263241] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#10B981]/50 transition-colors shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20">
                    <span className="text-2xl">🍱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8FAFC]">{sub.cook}</h3>
                    <p className="text-[#94A3B8] text-sm">{sub.plan} • Order {sub.id}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#10B981] uppercase tracking-wider">{sub.status}</span>
                  </div>
                  <p className="text-sm text-[#F8FAFC]">Next Meal: <span className="font-bold text-[#F4B942]">{sub.nextDelivery}</span></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="bg-[#111827] border border-[#263241] rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">No Active Subscriptions</h2>
            <p className="text-[#94A3B8]">You haven't subscribed to any tiffin plan yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;