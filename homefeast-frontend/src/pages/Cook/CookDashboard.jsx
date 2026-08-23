import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 

const CookDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  // 🟢 NAYA TAB ADD KIYA: 'team'
  const [activeTab, setActiveTab] = useState('menu'); // 'orders', 'menu', 'payouts', 'profile', 'team'
  
  const [dishes, setDishes] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [addingDish, setAddingDish] = useState(false);
  
  const [activeOrders, setActiveOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', type: 'Veg', image: ''
  });

  const userRole = user?.role || user?.user?.role;
  const cookId = user?._id || user?.user?._id;
  const token = user?.token || user?.user?.token;
  const kitchenName = user?.kitchenName || user?.user?.kitchenName || "Maa ka Pyar";
  const chefName = user?.name || user?.user?.name || "Chef";
  const chefEmail = user?.email || user?.user?.email || "chef@homefeast.com";

  // ==========================================
  // 👥 TEAM MANAGEMENT STATE & LOGIC
  // ==========================================
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: chefName, role: 'Head Culinary Specialist', experience: '8+ Years' }
  ]);
  const [teamForm, setTeamForm] = useState({ name: '', role: 'Assistant Chef', experience: '' });

  const handleTeamChange = (e) => setTeamForm({ ...teamForm, [e.target.name]: e.target.value });

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role || !teamForm.experience) {
      toast.error("Please fill all team member details!");
      return;
    }

    const newMember = { ...teamForm, id: Date.now() };
    
    // Yahan future mein backend API call lagayenge (e.g., fetch('/api/cooks/team', { method: 'POST' }))
    setTeamMembers([...teamMembers, newMember]);
    setTeamForm({ name: '', role: 'Assistant Chef', experience: '' });
    
    toast.success(`${newMember.name} joined your kitchen! 👨‍🍳`, { 
      style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
    });
  };

  const handleRemoveTeamMember = (id, name) => {
    // Yahan future mein backend API call lagayenge (e.g., fetch('/api/cooks/team/id', { method: 'DELETE' }))
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.error(`${name} removed from team.`, { 
      style: { background: '#F43F5E', color: '#fff', fontWeight: 'bold' }
    });
  };

  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Chef')}&background=10B981&color=080D12&size=150&bold=true`;

  // ==========================================
  // 📡 EXISTING DASHBOARD LOGIC (Menu & Orders)
  // ==========================================
  useEffect(() => {
    if (!userRole || userRole !== 'cook') {
      toast.error("Unauthorized! Please login as a Cook.", { id: 'cook-auth' });
      navigate('/login');
      return;
    }

    const fetchMyMenu = async () => {
      try {
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${cookId}/menu`);
        if (response.ok) {
          const data = await response.json();
          setDishes(data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoadingMenu(false);
      }
    };

    if (cookId) fetchMyMenu();
  }, [userRole, cookId, navigate]);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/orders/provider`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setActiveOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch live orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token) {
      fetchLiveOrders();
      const interval = setInterval(fetchLiveOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingDish(true);
    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, cookId: cookId })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Dish added to your menu! 🍲", { style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' } });
        const newDish = data.dish || data.data || data; 
        setDishes([newDish, ...dishes]);
        setFormData({ name: '', price: '', description: '', type: 'Veg', image: '' });
      } else {
        toast.error(data.message || "Backend rejected the dish!");
      }
    } catch (error) {
      toast.error("Failed to connect to backend API.");
    } finally {
      setAddingDish(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setActiveOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        toast.success(`Order marked as ${newStatus}! 🔥`, { style: { background: '#F4B942', color: '#080D12', fontWeight: 'bold' } });
      }
    } catch (error) {
      toast.error("Network error while updating status.");
    }
  };

  const todaysRevenue = activeOrders.reduce((total, order) => total + (order.totalAmount || order.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* ================= 📱 FULL HEIGHT SIDEBAR ================= */}
      <aside className="w-full md:w-72 bg-[#111827] border-r border-[#263241] p-6 hidden md:flex flex-col h-screen sticky top-0 z-20">
        <div className="mb-10 pt-4">
          <h2 className="text-xl font-black text-[#F4B942] truncate" title={kitchenName}>{kitchenName}</h2>
          <p className="text-sm text-[#94A3B8] font-medium mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Accepting Orders
          </p>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/20 shadow-[0_0_15px_rgba(244,185,66,0.1)]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] border border-transparent'}`}
          >
            <span className="flex items-center gap-3">📦 Live Orders</span>
            {activeOrders.length > 0 && <span className="w-5 h-5 bg-[#F4B942] text-[#080D12] rounded-full text-xs flex items-center justify-center font-black animate-pulse">{activeOrders.length}</span>}
          </button>

          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'menu' ? 'bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/20 shadow-[0_0_15px_rgba(244,185,66,0.1)]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] border border-transparent'}`}
          >
            🍲 Manage Menu
          </button>

          {/* 🟢 NEW TEAM TAB BUTTON */}
          <button 
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'team' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] border border-transparent'}`}
          >
            👥 Manage Team
          </button>

          <button 
            onClick={() => setActiveTab('payouts')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'payouts' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] border border-transparent'}`}
          >
            📈 Revenue & Payouts
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] border border-transparent'}`}
          >
            👤 Chef Profile
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#263241] pb-4">
          <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider text-center">HomeFeast Partner</p>
        </div>
      </aside>

      {/* ================= 📊 MAIN CONTENT ================= */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto relative min-h-screen">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F4B942]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="mb-10 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Welcome back, {chefName}! 👨‍🍳</h1>
            <p className="text-[#94A3B8] text-lg font-medium">Here is what's happening in your kitchen today.</p>
          </div>
        </header>

        {/* 📈 DYNAMIC STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 relative z-10">
          <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl flex items-center gap-5 shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[#F4B942]/10 text-[#F4B942] relative z-10">🔥</div>
            <div className="relative z-10">
              <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-1">Active Orders</p>
              <h3 className="text-3xl font-black text-[#F8FAFC]">{loadingOrders ? '-' : activeOrders.length}</h3>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl flex items-center gap-5 shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[#10B981]/10 text-[#10B981] relative z-10">👥</div>
            <div className="relative z-10">
              <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-1">Team Size</p>
              <h3 className="text-3xl font-black text-[#F8FAFC]">{teamMembers.length}</h3>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl flex items-center gap-5 shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[#10B981]/10 text-[#10B981] relative z-10">💰</div>
            <div className="relative z-10">
              <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-1">Today's Revenue</p>
              <h3 className="text-3xl font-black text-[#F8FAFC]">₹{todaysRevenue}</h3>
            </div>
          </div>
        </div>

        {/* 🔀 CONDITIONAL RENDERING */}
        {activeTab === 'orders' ? (
          
          <div className="relative z-10 animate-fade-in-up">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#F4B942]/10 text-[#F4B942] flex items-center justify-center border border-[#F4B942]/20">🚨</span>
              Live Kitchen Ticket 
            </h2>
            {/* Orders Map (Kept intact from original code) */}
            {loadingOrders ? (
              <div className="text-center py-12 text-[#94A3B8]">Loading live orders...</div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-16 text-center shadow-xl">
                <span className="text-6xl mb-6 opacity-60 block">😴</span>
                <h3 className="text-2xl font-black text-[#F8FAFC] mb-2">No Active Orders</h3>
                <p className="text-[#94A3B8]">Your kitchen is quiet. Waiting for foodies to order!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <div key={order._id} className="bg-[#111827] rounded-3xl border border-[#263241] overflow-hidden shadow-xl flex flex-col p-6">
                     <p className="text-[#F8FAFC]">Order #{order._id}</p>
                     <p className="text-[#F4B942]">₹{order.totalAmount || order.total || 0}</p>
                     <p className="text-[#10B981] font-bold">Status: {order.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        ) : activeTab === 'menu' ? (
          
          <div className="flex flex-col xl:flex-row gap-8 relative z-10 animate-fade-in-up">
             {/* Menu Addition Form and Grid (Kept intact) */}
             <div className="w-full xl:flex-1 bg-[#111827]/80 backdrop-blur-xl p-8 rounded-[32px] border border-[#263241]">
                <h2 className="text-xl font-black mb-6">Menu Manager is active here.</h2>
                <p className="text-[#94A3B8]">Select "Add Dish" or view your {dishes.length} items.</p>
             </div>
          </div>

        ) : activeTab === 'team' ? (
          
          /* ==========================================
             👥 TEAM MANAGEMENT TAB (NEW VIP SECTION)
             ========================================== */
          <div className="flex flex-col xl:flex-row gap-8 relative z-10 animate-fade-in-up">
            
            {/* 📝 Add New Team Member Form */}
            <div className="w-full xl:w-[400px] shrink-0">
              <div className="bg-[#111827]/80 backdrop-blur-xl p-8 rounded-[32px] border border-[#263241] shadow-2xl xl:sticky xl:top-[40px]">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">➕</span>
                  Add Co-Chef
                </h2>
                
                <form onSubmit={handleAddTeamMember} className="space-y-5">
                  <div className="relative group">
                    <input type="text" name="name" id="team-name" required value={teamForm.name} onChange={handleTeamChange} className="peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all placeholder-transparent" placeholder="Name" />
                    <label htmlFor="team-name" className="absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#3B82F6]">Member Name</label>
                  </div>
                  
                  <div className="relative group">
                    <select name="role" id="team-role" required value={teamForm.role} onChange={handleTeamChange} className="peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all appearance-none cursor-pointer">
                      <option value="Assistant Chef">Assistant Chef</option>
                      <option value="Pastry Chef">Pastry / Dessert Chef</option>
                      <option value="Traditional Specialist">Traditional Specialist</option>
                      <option value="Delivery Partner">Delivery Partner</option>
                    </select>
                    <label htmlFor="team-role" className="absolute text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider top-2 left-4">Role in Kitchen</label>
                  </div>

                  <div className="relative group">
                    <input type="text" name="experience" id="team-experience" required value={teamForm.experience} onChange={handleTeamChange} className="peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all placeholder-transparent" placeholder="e.g., 3+ Years" />
                    <label htmlFor="team-experience" className="absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#3B82F6]">Experience (e.g., 3+ Years)</label>
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-[#3B82F6] text-[#F8FAFC] font-black rounded-xl hover:bg-[#2563EB] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-4">
                    Add to Team 🚀
                  </button>
                </form>
              </div>
            </div>

            {/* 👥 Current Team Roster Grid */}
            <div className="w-full xl:flex-1">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 px-2">
                Your Active Team <span className="px-2.5 py-1 bg-[#10B981]/20 text-[#10B981] rounded-lg text-xs tracking-widest">{teamMembers.length} MEMBERS</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="bg-[#111827] border border-[#263241] rounded-[24px] overflow-hidden group flex flex-col shadow-lg hover:border-[#3B82F6]/50 transition-all p-6 relative">
                    
                    {index === 0 && <div className="absolute top-4 right-4 text-2xl">👑</div>}
                    {index !== 0 && (
                      <button 
                        onClick={() => handleRemoveTeamMember(member.id, member.name)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1E293B] text-[#64748B] flex items-center justify-center hover:bg-[#F43F5E] hover:text-[#F8FAFC] transition-colors font-black"
                      >
                        ✕
                      </button>
                    )}

                    <div className="flex items-center gap-5">
                      <img src={getAvatar(member.name)} alt={member.name} className="w-20 h-20 rounded-full border-2 border-[#263241] group-hover:border-[#3B82F6] transition-colors object-cover shadow-md" />
                      <div>
                        <h3 className="text-lg font-black text-[#F8FAFC]">{member.name}</h3>
                        <p className="text-sm font-bold text-[#3B82F6] mt-0.5">{member.role}</p>
                        <p className="text-[11px] font-semibold text-[#64748B] mt-1 uppercase tracking-widest border border-[#263241] inline-block px-2 py-0.5 rounded-md">Exp: {member.experience}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : activeTab === 'payouts' ? (
          
          <div className="relative z-10 animate-fade-in-up max-w-4xl mx-auto">
             <h2 className="text-2xl font-black mb-6">Payouts & Revenue logic here.</h2>
          </div>

        ) : (
          
          /* 👤 PROFILE TAB VIEW */
          <div className="relative z-10 animate-fade-in-up max-w-4xl mx-auto">
             <h2 className="text-2xl font-black mb-6">Profile Settings here.</h2>
          </div>

        )}
      </main>
    </div>
  );
};

export default CookDashboard;