import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Token aur User ke liye

const ProviderDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); // Logged-in user fetch karein
  
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [address, setAddress] = useState(''); // Address input state
  const [isOrdering, setIsOrdering] = useState(false); // Loading state for button
  
  const [provider, setProvider] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch provider details');
        
        const data = await response.json();
        setProvider(data.profile);
        setMenu(data.menu);
        
        if (data.menu.length > 0) {
          setSelectedPlan(data.menu[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  // --- PLACE ORDER LOGIC ---
  const handlePlaceOrder = async () => {
    // 1. Check if user is logged in
    if (!user) {
      alert("Please log in to place an order.");
      navigate('/login');
      return;
    }

    // 2. Check if address is filled
    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    // 3. Find the selected menu item details
    const selectedItem = menu.find(m => m._id === selectedPlan);

    try {
      setIsOrdering(true);
      
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          cookId: id, // URL parameter se mil raha hai
          plan: selectedItem.planType,
          totalAmount: selectedItem.price,
          deliveryAddress: address
        })
      });

      if (response.ok) {
        alert("🎉 Subscription placed successfully!");
        navigate('/customer'); // Redirect back to dashboard
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while placing the order.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center text-rose-500 font-bold flex-col gap-4">
        <p>{error || "Provider not found"}</p>
        <Link to="/customer" className="text-[#10B981] hover:underline">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-20">
      
      {/* 1. Hero Cover Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#111827]">
        <img 
          src={"https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80"} 
          alt={provider.kitchenName}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/60 to-transparent"></div>
        
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link to="/customer" className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC] bg-[#111827]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#263241] hover:bg-[#111827] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Discovery
          </Link>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Provider Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                FSSAI {provider.fssaiStatus}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">
              {provider.kitchenName}
            </h1>
            <p className="text-[#94A3B8] text-lg">Chef: {provider.user?.name} {provider.cuisine ? `• ${provider.cuisine}` : ''}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#111827] border border-[#263241] px-4 py-2 rounded-2xl">
            <svg className="w-6 h-6 text-[#F4B942]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div>
              <span className="text-xl font-bold text-[#F8FAFC]">{provider.rating || 'New'}</span>
              <span className="text-sm text-[#94A3B8] ml-2">({provider.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Tabs & Menu */}
          <div className="lg:col-span-2">
            <div className="flex border-b border-[#263241] mb-6">
              <button 
                onClick={() => setActiveTab('menu')}
                className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider mr-8 transition-colors ${activeTab === 'menu' ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
              >
                Available Menu
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === 'menu' && (
                <div className="space-y-4 animate-fade-in">
                  {menu.length === 0 ? (
                    <p className="text-[#94A3B8]">This cook hasn't added any menu items yet.</p>
                  ) : (
                    menu.map((item) => (
                      <div key={item._id} className="bg-[#111827] border border-[#263241] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#10B981]/30 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-[#F8FAFC]">{item.dishName}</h4>
                            {!item.isAvailable && <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">Out of Stock</span>}
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded">{item.mealType}</span>
                            <span className="text-xs font-bold text-[#94A3B8] bg-[#263241] px-2 py-1 rounded">{item.planType} Plan</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-[#F4B942]">₹{item.price}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Subscription Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#111827] border border-[#263241] rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-6">Subscribe & Order</h3>
              
              {menu.length === 0 ? (
                <p className="text-[#94A3B8] text-sm text-center mb-6">No active plans available to subscribe right now.</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {menu.filter(m => m.isAvailable).map(plan => (
                      <label 
                        key={plan._id}
                        className={`block cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                          selectedPlan === plan._id 
                            ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                            : 'bg-[#080D12] border-[#263241] hover:border-[#64748B]'
                        }`}
                        onClick={() => setSelectedPlan(plan._id)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === plan._id ? 'border-[#10B981]' : 'border-[#64748B]'}`}>
                              {selectedPlan === plan._id && <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>}
                            </div>
                            <span className="font-bold text-[#F8FAFC] text-sm">{plan.dishName}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-2 ml-8">
                           <span className="text-xs text-[#94A3B8]">{plan.planType} Plan</span>
                           <span className="font-black text-[#10B981]">₹{plan.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Delivery Address Input */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address..."
                      className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-sm resize-none h-20"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={!selectedPlan || isOrdering}
                    className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#263241] disabled:text-[#64748B] disabled:cursor-not-allowed text-[#080D12] font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 mb-3"
                  >
                    {isOrdering ? 'Processing...' : 'Place Order'}
                  </button>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;