import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const CookDashboard = () => {
  const { user } = useAuth(); // Logged-in user ki details aur token
  const [activeTab, setActiveTab] = useState('menu');
  
  // Real Data States
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Dish Form State
  const [newDish, setNewDish] = useState({
    dishName: '',
    price: '',
    mealType: 'Pure Veg', // Backend Enum matches: 'Pure Veg', 'Non-Veg', 'Vegan'
    planType: 'Daily'     // Backend Enum matches: 'Daily', 'Weekly', 'Monthly'
  });

  // 1. Fetch Cook's Real Menu from Database
  const fetchMyMenu = async () => {
    try {
      setLoading(true);
      // getCookDetails API call using the logged-in user's ID
      const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menu || []);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyMenu();
    }
  }, [user]);

  // 2. Add New Dish to Database
  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/menu', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Security Guard (Middleware) ke liye token
        },
        body: JSON.stringify({
          ...newDish,
          price: Number(newDish.price) // Price ko number mein convert kiya
        }),
      });

      if (response.ok) {
        // Form hide karein, reset karein, aur naya menu fetch karein
        setShowAddForm(false);
        setNewDish({ dishName: '', price: '', mealType: 'Pure Veg', planType: 'Daily' });
        fetchMyMenu();
      } else {
        alert("Failed to add dish. Please try again.");
      }
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  // Handle Input Changes for Add Form
  const handleChange = (e) => {
    setNewDish({ ...newDish, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#F8FAFC]">
                Welcome, <span className="text-[#10B981]">{user?.name?.split(' ')[0] || 'Chef'}</span>
              </h1>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Cook
              </span>
            </div>
            <p className="text-[#94A3B8] text-sm">Manage your menu, subscriptions, and daily deliveries.</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab('menu');
              setShowAddForm(!showAddForm);
            }}
            className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors text-sm"
          >
            {showAddForm ? 'Cancel Adding' : '+ Add New Dish'}
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex overflow-x-auto border-b border-[#263241] mb-8 hide-scrollbar">
          {['overview', 'menu', 'orders'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-[#10B981] border-b-2 border-[#10B981]' 
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="min-h-[500px]">
          
          {/* 1. OVERVIEW TAB (Dummy Data for now) */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Earnings Card */}
                <div className="bg-[#111827] border border-[#263241] p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 rounded-full blur-2xl"></div>
                  <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">Total Earnings</p>
                  <h3 className="text-3xl font-black text-[#F8FAFC]">₹0</h3>
                  <p className="text-[#10B981] text-xs mt-2">Just starting out!</p>
                </div>
                {/* Menu Items Card */}
                <div className="bg-[#111827] border border-[#263241] p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6]/5 rounded-full blur-2xl"></div>
                  <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">Dishes in Menu</p>
                  <h3 className="text-3xl font-black text-[#F8FAFC]">{menuItems.length}</h3>
                  <p className="text-[#94A3B8] text-xs mt-2">Active items</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. MENU TAB (REAL DATA) */}
          {activeTab === 'menu' && (
            <div className="animate-fade-in">
              
              {/* Add New Dish Form (Toggleable) */}
              {showAddForm && (
                <div className="bg-[#111827] border border-[#10B981]/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)] mb-8">
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Add a New Dish to Your Menu</h3>
                  <form onSubmit={handleAddDish} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Dish Name</label>
                      <input type="text" name="dishName" value={newDish.dishName} onChange={handleChange} required placeholder="e.g. Punjabi Deluxe Thali" className="w-full px-4 py-2.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Price (₹)</label>
                      <input type="number" name="price" value={newDish.price} onChange={handleChange} required placeholder="e.g. 150" className="w-full px-4 py-2.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Meal Type</label>
                      <select name="mealType" value={newDish.mealType} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]">
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Plan Type</label>
                      <select name="planType" value={newDish.planType} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button type="submit" className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-bold rounded-xl transition-colors">
                        Save Dish
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Menu List Table */}
              <div className="bg-[#111827] border border-[#263241] rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center text-[#94A3B8]">Loading menu...</div>
                ) : menuItems.length === 0 ? (
                  <div className="p-8 text-center text-[#94A3B8]">Your menu is empty. Click "+ Add New Dish" to get started!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#080D12] border-b border-[#263241]">
                          <th className="p-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Dish Name</th>
                          <th className="p-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Type & Plan</th>
                          <th className="p-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Price</th>
                          <th className="p-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#263241]">
                        {menuItems.map(item => (
                          <tr key={item._id} className="hover:bg-[#080D12]/50 transition-colors">
                            <td className="p-4 font-bold text-[#F8FAFC]">{item.dishName}</td>
                            <td className="p-4 flex gap-2">
                              <span className="text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-1 rounded">{item.mealType}</span>
                              <span className="text-[10px] font-bold bg-[#263241] text-[#94A3B8] px-2 py-1 rounded">{item.planType}</span>
                            </td>
                            <td className="p-4 text-[#10B981] font-bold">₹{item.price}</td>
                            <td className="p-4">
                              <span className={`text-xs font-black uppercase tracking-wider ${item.isAvailable ? 'text-[#10B981]' : 'text-rose-500'}`}>
                                {item.isAvailable ? 'Available' : 'Out of Stock'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in p-8 text-center bg-[#111827] border border-[#263241] rounded-2xl text-[#94A3B8]">
              You have no active orders right now. Add dishes to your menu to start receiving subscriptions!
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CookDashboard;