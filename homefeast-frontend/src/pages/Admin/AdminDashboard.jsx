import { useState } from 'react';

// --- MOCK DATA FOR ADMIN ---
const stats = [
  { id: 1, label: "Total Platform Users", value: "12,450", trend: "+15% this month", positive: true },
  { id: 2, label: "Active Home Cooks", value: "342", trend: "+5 new this week", positive: true },
  { id: 3, label: "Platform Revenue (10% Cut)", value: "₹1,25,000", trend: "+22% this month", positive: true },
  { id: 4, label: "Pending Approvals", value: "8", trend: "Requires action", positive: false },
];

const pendingCooks = [
  { id: 101, name: "Sushma's Kitchen", cuisine: "Maharashtrian", location: "Andheri West", fssai: "Verified" },
  { id: 102, name: "The Healthy Bowl", cuisine: "Keto & Salads", location: "Bandra", fssai: "Pending" },
  { id: 103, name: "Nizam Delights", cuisine: "Mughlai", location: "Colaba", fssai: "Verified" },
];

const recentOrders = [
  { id: 5001, customer: "Rahul S.", cook: "Aunty's Kitchen", amount: "₹2,500", status: "Active Sub" },
  { id: 5002, customer: "Priya P.", cook: "Spice Route", amount: "₹120", status: "Delivered" },
  { id: 5003, customer: "Amit K.", cook: "Maa Ki Rasoi", amount: "₹90", status: "Preparing" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-8 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC]">
              Admin <span className="text-[#10B981]">Command Center</span>
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">Monitor platform health, approve cooks, and manage transactions.</p>
          </div>
          <button className="bg-[#263241] hover:bg-[#334155] text-[#F8FAFC] border border-[#263241] hover:border-[#64748B] font-bold px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Monthly Report
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#263241] mb-8 overflow-x-auto hide-scrollbar">
          {['overview', 'cook approvals', 'users', 'transactions', 'settings'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-[#10B981] border-b-2 border-[#10B981]' 
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-[#111827] border border-[#263241] rounded-2xl p-6 shadow-sm hover:border-[#10B981]/30 transition-colors">
                  <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-[#F8FAFC] mb-2">{stat.value}</h3>
                  <p className={`text-xs font-bold flex items-center gap-1 ${stat.positive ? 'text-[#10B981]' : 'text-rose-500'}`}>
                    {stat.positive ? '↑' : '↓'} {stat.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Pending Cook Approvals */}
              <div className="lg:col-span-2">
                <div className="bg-[#111827] border border-[#263241] rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">Action Required: Cook Approvals</h2>
                    <span className="bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/30">
                      {pendingCooks.length} Pending
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {pendingCooks.map((cook) => (
                      <div key={cook.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#080D12] border border-[#263241] hover:border-[#F4B942]/50 transition-colors gap-4">
                        <div>
                          <h4 className="font-bold text-[#F8FAFC] text-lg">{cook.name}</h4>
                          <p className="text-xs text-[#94A3B8] mt-1">
                            {cook.cuisine} • {cook.location}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-[#64748B]">FSSAI Status:</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              cook.fssai === 'Verified' 
                                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' 
                                : 'bg-[#F4B942]/10 text-[#F4B942] border-[#F4B942]/30'
                            }`}>
                              {cook.fssai}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button className="flex-1 sm:flex-none bg-[#10B981] hover:bg-[#059669] text-[#080D12] text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                            Approve
                          </button>
                          <button className="flex-1 sm:flex-none bg-transparent hover:bg-[#263241] text-[#E5E7EB] border border-[#263241] text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                            Review Docs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-6 text-sm font-bold text-[#10B981] hover:text-[#34D399] transition-colors">
                    View All Applications &rarr;
                  </button>
                </div>
              </div>

              {/* Right Side: Live Platform Feed */}
              <div className="lg:col-span-1">
                <div className="bg-[#111827] border border-[#263241] rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#F8FAFC] mb-6">Live Activity Feed</h2>

                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="p-3 rounded-xl bg-[#080D12] border border-[#263241]">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-[#94A3B8]">Order #{order.id}</span>
                          <span className="text-xs font-black text-[#10B981]">{order.amount}</span>
                        </div>
                        <p className="text-sm font-medium text-[#F8FAFC]">{order.customer} <span className="text-[#64748B] font-normal">ordered from</span> {order.cook}</p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-[#263241]/50 text-[#E5E7EB] text-[10px] font-bold rounded">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;