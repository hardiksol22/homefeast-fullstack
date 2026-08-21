import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CookDashboard = () => {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingDish, setAddingDish] = useState(false);
  
  // Cook ki details LocalStorage se nikal rahe hain (Login ke baad save hoti hai)
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    type: 'Veg',
    image: ''
  });

  // 1. 📡 FETCH COOK'S MENU FROM BACKEND
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'cook') {
      toast.error("Unauthorized! Please login as a Cook.");
      navigate('/login');
      return;
    }

    const fetchMyMenu = async () => {
      try {
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${userInfo._id}/menu`);
        if (response.ok) {
          const data = await response.json();
          setDishes(data);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        toast.error("Failed to load your menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyMenu();
  }, [navigate, userInfo]);

  // 2. 📝 HANDLE FORM CHANGES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. 🚀 ADD NEW DISH TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingDish(true);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cooks/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}` // 🔒 Secure Token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Dish added to your menu! 🍲", {
          style: { background: '#10B981', color: '#080D12' }
        });
        // Nayi dish ko bina refresh kiye list me add kar do
        setDishes([data, ...dishes]);
        // Form clear kar do
        setFormData({ name: '', price: '', description: '', type: 'Veg', image: '' });
      } else {
        toast.error(data.message || "Failed to add dish");
      }
    } catch (error) {
      console.error("Error adding dish:", error);
      toast.error("Server connection error.");
    } finally {
      setAddingDish(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-20 relative overflow-hidden">
      
      {/* 🌟 Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F4B942]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4B942]/10 border border-[#F4B942]/20 mb-5 shadow-[0_0_15px_rgba(244,185,66,0.15)]">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-widest">Kitchen Admin Panel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4B942] to-[#FCD34D]">{userInfo.kitchenName || 'Chef'}</span> 👨‍🍳
          </h1>
          <p className="text-[#94A3B8] text-lg font-medium">Manage your kitchen menu and track your daily dishes.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ================= LEFT: ADD DISH FORM ================= */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#111827]/80 backdrop-blur-xl p-8 rounded-[32px] border border-[#263241] shadow-[0_20px_50px_rgba(0,0,0,0.3)] sticky top-28">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-lg">🍳</span>
                Add New Dish
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Dish Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Paneer Butter Masala" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Price (₹)</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="e.g., 250" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all appearance-none cursor-pointer">
                      <option value="Veg">🟢 Veg</option>
                      <option value="Non-Veg">🔴 Non-Veg</option>
                      <option value="Egg">🟡 Egg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" rows="3" required value={formData.description} onChange={handleChange} placeholder="What makes this dish special?" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Image URL (Optional)</label>
                  <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all" />
                </div>

                <button type="submit" disabled={addingDish} className="w-full py-4 bg-[#F4B942] text-[#080D12] font-black rounded-xl hover:bg-[#D9A02E] transition-all shadow-[0_0_20px_rgba(244,185,66,0.2)] hover:shadow-[0_0_30px_rgba(244,185,66,0.4)] mt-4">
                  {addingDish ? 'Adding to Menu...' : 'Publish Dish 🚀'}
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT: LIVE MENU DISPLAY ================= */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-lg">📜</span>
              Your Current Menu
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Skeleton Loaders */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-[#111827] border border-[#263241] rounded-3xl h-[300px] animate-pulse flex flex-col overflow-hidden">
                    <div className="h-40 bg-[#1E293B]"></div>
                    <div className="p-5 flex-1">
                      <div className="h-6 bg-[#1E293B] rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-[#1E293B] rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : dishes.length === 0 ? (
              <div className="bg-[#111827] border border-[#263241] rounded-[32px] p-12 text-center flex flex-col items-center justify-center h-[500px]">
                <span className="text-6xl mb-6 opacity-80">🍽️</span>
                <h3 className="text-2xl font-black text-[#F8FAFC] mb-3">Your Menu is Empty</h3>
                <p className="text-[#94A3B8] max-w-md">You haven't added any dishes yet. Start adding delicious meals using the form to attract customers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dishes.map((dish) => (
                  <div key={dish._id} className="bg-[#111827] border border-[#263241] rounded-3xl overflow-hidden group hover:border-[#F4B942]/50 transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(244,185,66,0.1)] flex flex-col">
                    
                    <div className="relative h-48 w-full bg-[#1E293B] overflow-hidden">
                      <img 
                        src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"} 
                        alt={dish.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent"></div>
                      
                      {/* Veg/Non-Veg Tag */}
                      <div className="absolute top-4 right-4 bg-[#080D12]/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#263241]">
                        <span className={`w-2.5 h-2.5 rounded-full ${dish.type === 'Veg' ? 'bg-[#10B981]' : dish.type === 'Non-Veg' ? 'bg-rose-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">{dish.type}</span>
                      </div>
                    </div>

                    <div className="p-6 relative flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-[#F8FAFC] line-clamp-1">{dish.name}</h3>
                        <span className="text-lg font-black text-[#10B981]">₹{dish.price}</span>
                      </div>
                      <p className="text-[#94A3B8] text-sm line-clamp-2 mb-4 leading-relaxed">{dish.description}</p>
                      
                      <div className="mt-auto pt-4 border-t border-[#263241]/50 flex justify-between items-center">
                        <span className="text-xs text-[#64748B] font-bold">Added to Live Menu</span>
                        <button className="text-rose-500 hover:text-rose-400 text-sm font-bold transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookDashboard;