import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CookDashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview'); 
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    dishName: '', price: '', description: '', mealType: 'Pure Veg', planType: 'Daily', image: '' 
  });

  // 🟢 1. FETCH REAL DATA ON LOAD (Menu & Orders)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem('token');
        
        // Fetch Menu Items from Backend
        const menuRes = await fetch('https://homefeast-fullstack.onrender.com/api/menu/my-menu', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }

        // Fetch Orders from Backend
        const ordersRes = await fetch('https://homefeast-fullstack.onrender.com/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (err) {
        toast.error("Failed to fetch real data. Is backend running?");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 2. ADD REAL ITEM TO DATABASE
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/menu', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newItem = await response.json();
        toast.success("Dish published live!");
        setMenuItems([...menuItems, newItem.menuItem || newItem]); // Update UI instantly
        setShowAddForm(false);
        setFormData({ dishName: '', price: '', description: '', mealType: 'Pure Veg', planType: 'Daily', image: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add dish.");
      }
    } catch (err) {
      toast.error("Server connection error!");
    }
  };

  // 🟢 3. DELETE REAL ITEM FROM DATABASE
  const handleDeleteItem = async (id) => {
    if(!window.confirm("Are you sure you want to delete this dish?")) return;
    
    try {
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token || localStorage.getItem('token')}` }
      });

      if (response.ok) {
        toast.success("Dish deleted successfully!");
        setMenuItems(menuItems.filter(item => item._id !== id)); // Remove from UI
      } else {
        toast.error("Failed to delete dish");
      }
    } catch (err) {
      toast.error("Server connection error!");
    }
  };

  // 🟢 4. UPDATE REAL ORDER STATUS
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Order marked as ${newStatus}!`);
        // Update local state instantly
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error("Server connection error!");
    }
  };

  // 🟢 5. REAL DYNAMIC CALCULATIONS FOR OVERVIEW TAB
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');
  const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Completed');
  // Total Earning unhi orders ki hogi jo complete ho gaye hain
  const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-48 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="bg-[#111827] border border-[#263241] rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-6 w-full md:w-auto">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center text-4xl shadow-lg transform rotate-3">
                👨‍🍳
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#F4B942] text-[#080D12] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Pro</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-2 py-1 rounded uppercase font-bold tracking-widest">Kitchen Admin</span>
                <span className="flex items-center gap-1 text-[10px] text-[#94A3B8] font-bold"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> Online</span>
              </div>
              <h1 className="text-3xl font-black text-[#F8FAFC]">Hello, <span className="text-[#10B981]">{user?.name?.split(' ')[0] || 'Chef'}</span></h1>
            </div>
          </div>

          <button onClick={() => { setActiveTab('menu'); setShowAddForm(true); }} className="mt-6 md:mt-0 w-full md:w-auto px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 z-10 flex items-center justify-center gap-2">
            + Add New Dish
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#263241] mb-8 overflow-x-auto custom-scrollbar">
          {['overview', 'menu', 'orders'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 relative ${activeTab === tab ? 'text-[#10B981]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              {tab === 'overview' ? '📊 Dashboard Overview' : tab === 'menu' ? '🍔 Manage Menu' : '🔔 Live Orders'}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#10B981] rounded-t-full"></span>}
            </button>
          ))}
        </div>

        {/* =========================================
            TAB 1: REAL OVERVIEW (ANALYTICS)
        ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl relative overflow-hidden group hover:border-[#10B981]/50 transition-colors">
                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">💰</div>
                <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                <h3 className="text-3xl font-black text-[#F8FAFC]">₹{totalRevenue}</h3>
                <p className="text-xs text-[#10B981] mt-2 font-bold">Lifetime earnings</p>
              </div>

              <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">📦</div>
                <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2">Active Orders</p>
                <h3 className="text-3xl font-black text-[#F8FAFC]">{activeOrders.length}</h3>
                <p className="text-xs text-[#3B82F6] mt-2 font-bold">Needs preparation</p>
              </div>

              <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl relative overflow-hidden group hover:border-[#F4B942]/50 transition-colors">
                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">✅</div>
                <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2">Completed Orders</p>
                <h3 className="text-3xl font-black text-[#F8FAFC]">{completedOrders.length}</h3>
                <p className="text-xs text-[#F4B942] mt-2 font-bold">Successfully delivered</p>
              </div>

              <div className="bg-[#111827] border border-[#263241] p-6 rounded-3xl relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-colors">
                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">🍲</div>
                <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-2">Menu Items</p>
                <h3 className="text-3xl font-black text-[#F8FAFC]">{menuItems.length}</h3>
                <p className="text-xs text-[#8B5CF6] mt-2 font-bold">Live on platform</p>
              </div>

            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: REAL MANAGE MENU (ADD/DELETE)
        ========================================== */}
        {activeTab === 'menu' && (
          <div className="animate-fade-in-up">
            {showAddForm && (
              <div className="bg-[#111827] border border-[#10B981]/30 rounded-3xl p-6 sm:p-8 mb-10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#10B981]">Add New Dish</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-[#64748B] hover:text-rose-500 font-bold text-sm bg-[#080D12] px-3 py-1.5 rounded-lg border border-[#263241]">Close</button>
                </div>
                <form onSubmit={handleAddItem} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Dish Name</label>
                      <input type="text" name="dishName" required value={formData.dishName} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Price (₹)</label>
                      <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Description</label>
                    <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none resize-none"></textarea>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Image URL (Optional)</label>
                     <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Meal Type</label>
                      <select name="mealType" value={formData.mealType} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none">
                        <option value="Pure Veg">🌿 Pure Veg</option>
                        <option value="Non-Veg">🍗 Non-Veg</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Plan Type</label>
                      <select name="planType" value={formData.planType} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none">
                        <option value="Daily">Daily Plan</option>
                        <option value="Weekly">Weekly Plan</option>
                        <option value="Monthly">Monthly Plan</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full px-10 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all">Publish Dish</button>
                </form>
              </div>
            )}

            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Your Live Menu</h2>
              {!showAddForm && <button onClick={() => setShowAddForm(true)} className="text-sm font-bold text-[#10B981] hover:underline">+ Add New</button>}
            </div>
            
            {menuItems.length === 0 ? (
              <div className="bg-[#111827] border border-[#263241] border-dashed rounded-3xl p-16 text-center">
                <span className="text-6xl mb-4 block opacity-50">🍽️</span>
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Menu is Empty</h3>
                <p className="text-[#94A3B8] mb-6">Start building your menu to get orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item._id} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden shadow-lg flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-[#1E293B]">
                      <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={item.dishName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">{item.dishName}</h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-2 mb-4">{item.description}</p>
                      <div className="mt-auto flex justify-between items-center border-t border-[#263241] pt-4">
                        <span className="text-2xl font-black text-[#F8FAFC]">₹{item.price}</span>
                        {/* 🟢 REAL DELETE BUTTON */}
                        <button onClick={() => handleDeleteItem(item._id)} className="text-rose-500 font-bold hover:underline text-sm">
                          Remove Dish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: REAL LIVE ORDERS
        ========================================== */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in-up space-y-4">
            {orders.length === 0 ? (
               <div className="bg-[#111827] border border-[#263241] rounded-3xl p-16 text-center">
                 <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Orders Yet</h3>
                 <p className="text-[#94A3B8]">When customers buy your food, orders will appear here.</p>
               </div>
            ) : (
               orders.map((order) => (
                <div key={order._id} className="bg-[#111827] border border-[#263241] rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#F8FAFC]">Order ID: {order._id.substring(0, 8)}</h4>
                    <p className="text-sm text-[#94A3B8] font-bold mt-1">Status: <span className={order.status === 'Completed' ? 'text-[#10B981]' : 'text-[#F4B942]'}>{order.status}</span></p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <p className="text-xl font-black text-[#F8FAFC]">₹{order.totalAmount}</p>
                    {/* 🟢 REAL STATUS UPDATE BUTTONS */}
                    {order.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'Rejected')} className="px-4 py-2 bg-rose-500/10 text-rose-500 font-bold rounded-lg hover:bg-rose-500 hover:text-white">Reject</button>
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')} className="px-4 py-2 bg-[#10B981] text-[#080D12] font-black rounded-lg">Accept & Prepare</button>
                      </div>
                    )}
                    {order.status === 'Preparing' && (
                      <button onClick={() => handleUpdateOrderStatus(order._id, 'Completed')} className="px-4 py-2 bg-blue-500 text-white font-black rounded-lg">Mark Completed</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CookDashboard;