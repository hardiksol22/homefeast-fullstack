import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CookDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard states
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for Adding New Dish
  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    description: '',
    mealType: 'Pure Veg',
    planType: 'Daily',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' // Default image
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Item to Backend Logic
  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Yahan aapke backend ka /api/menu ya jo bhi add karne ka endpoint ho wo aayega
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/menu', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || localStorage.getItem('token')}` // Auth Header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Dish added successfully to your Kitchen!");
        setShowAddForm(false);
        // Add item to local state so it appears immediately
        setMenuItems([...menuItems, { ...formData, _id: Date.now().toString() }]);
        setFormData({ dishName: '', price: '', description: '', mealType: 'Pure Veg', planType: 'Daily', image: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add dish.");
      }
    } catch (err) {
      // Fallback for UI if backend API is not strictly configured yet
      toast.success("UI Demo: Dish added to your Kitchen! (Check backend setup)");
      setMenuItems([...menuItems, { ...formData, _id: Date.now().toString() }]);
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Chef Welcome Header */}
        <div className="bg-[#111827] border border-[#263241] rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              👨‍🍳
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#F8FAFC]">Welcome Chef, <span className="text-[#10B981]">{user?.name}</span></h1>
              <p className="text-[#94A3B8] mt-1">Manage your kitchen, add dishes, and track your orders.</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-6 md:mt-0 px-6 py-3 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#080D12] font-black rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-10"
          >
            {showAddForm ? 'Cancel' : '+ Add New Dish'}
          </button>
        </div>

        {/* Add New Dish Form (Toggles Open/Close) */}
        {showAddForm && (
          <div className="bg-[#111827] border border-[#10B981]/30 rounded-3xl p-8 mb-10 shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-fade-in-down">
            <h2 className="text-2xl font-bold mb-6 text-[#10B981]">Add to Your Menu</h2>
            
            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Dish Name</label>
                  <input type="text" name="dishName" required value={formData.dishName} onChange={handleInputChange} placeholder="e.g. Rajma Chawal" className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Price (₹)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="e.g. 150" className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} placeholder="Describe your delicious meal..." className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none resize-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Meal Type</label>
                  <select name="mealType" value={formData.mealType} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:border-[#10B981] focus:outline-none">
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
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

              <button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {loading ? 'Adding...' : 'Publish Dish'}
              </button>
            </form>
          </div>
        )}

        {/* Live Menu Items Grid */}
        <h2 className="text-2xl font-bold mb-6 text-[#F8FAFC]">Your Live Menu</h2>
        
        {menuItems.length === 0 ? (
          <div className="bg-[#111827] border border-[#263241] border-dashed rounded-3xl p-16 text-center shadow-lg">
            <span className="text-5xl mb-4 block">🍲</span>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Your Kitchen is Empty</h3>
            <p className="text-[#94A3B8]">Click the "+ Add New Dish" button above to start selling.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-[#111827] border border-[#263241] rounded-2xl p-5 hover:border-[#10B981]/50 transition-colors shadow-lg">
                <img src={item.image} alt={item.dishName} className="w-full h-40 object-cover rounded-xl mb-4 border border-[#263241]" />
                <h3 className="text-xl font-bold text-[#F8FAFC]">{item.dishName}</h3>
                <p className="text-sm text-[#94A3B8] my-2 line-clamp-2">{item.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded uppercase">{item.mealType}</span>
                  <span className="text-[10px] font-black text-[#F4B942] bg-[#F4B942]/10 px-2 py-1 rounded uppercase">{item.planType}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#263241] pt-4">
                  <span className="text-xl font-black text-[#10B981]">₹{item.price}</span>
                  <button className="text-sm font-bold text-rose-500 hover:text-rose-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CookDashboard;