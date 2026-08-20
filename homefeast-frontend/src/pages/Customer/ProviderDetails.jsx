import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; 
import toast from 'react-hot-toast';

const ProviderDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { addToCart } = useCart(); 
  
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [provider, setProvider] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        // 🟢 100% REAL FETCH ONLY
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/cooks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch provider details');
        
        const data = await response.json();
        setProvider(data.profile);
        setMenu(data.menu || []);
        
        if (data.menu && data.menu.length > 0) {
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

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    
    const selectedItem = menu.find(m => m._id === selectedPlan);
    if (selectedItem) {
      addToCart(selectedItem, provider.kitchenName); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center text-rose-500 font-bold flex-col gap-4 pt-20">
        <span className="text-5xl">⚠️</span>
        <p className="text-xl">{error || "Provider not found in Database"}</p>
        <Link to="/explore" className="text-[#10B981] hover:underline">Go back to Kitchens</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pb-20 relative">
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#111827]">
        <img src={provider.image || "https://images.unsplash.com/photo-1585937421612-70a008356fbe"} alt={provider.kitchenName} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D12] via-[#080D12]/60 to-transparent"></div>
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link to="/explore" className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC] bg-[#111827]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#263241] hover:bg-[#111827]">
            Back to Kitchens
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">{provider.kitchenName}</h1>
            <p className="text-[#94A3B8] text-lg">by {provider.user?.name} {provider.cuisine ? `• ${provider.cuisine}` : ''}</p>
          </div>
          <div className="flex items-center gap-2 bg-[#111827] border border-[#263241] px-5 py-3 rounded-2xl">
            <span className="text-2xl font-black text-[#F4B942]">⭐ {provider.rating || '0.0'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          <div className="lg:col-span-2">
            <div className="flex border-b border-[#263241] mb-6">
              <button className="pb-4 px-2 text-sm font-bold uppercase tracking-wider mr-8 text-[#10B981] border-b-2 border-[#10B981]">
                Available Menu
              </button>
            </div>

            <div className="min-h-[400px]">
              <div className="space-y-4">
                {menu.length === 0 ? (
                  <div className="text-center py-10 bg-[#111827] rounded-3xl border border-[#263241]">
                    <p className="text-[#94A3B8]">This chef hasn't added any menu items to the database yet.</p>
                  </div>
                ) : (
                  menu.map((item) => (
                    <div key={item._id} className="bg-[#111827] border border-[#263241] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                      <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={item.dishName} className="w-full sm:w-24 h-32 sm:h-24 rounded-xl object-cover border border-[#263241]" />
                      <div className="flex-1 mt-2 sm:mt-0">
                        <h4 className="text-lg font-bold text-[#F8FAFC] mb-1">{item.dishName}</h4>
                        <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded uppercase">{item.mealType}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-4 sm:mt-0">
                        <span className="text-2xl font-black text-[#F8FAFC]">₹{item.price}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#111827] border border-[#263241] rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-6">Select a Plan</h3>
              {menu.length === 0 ? (
                <p className="text-[#94A3B8] text-sm text-center mb-6">No active plans available right now.</p>
              ) : (
                <>
                  <div className="space-y-4 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {menu.filter(m => m.isAvailable !== false).map(plan => (
                      <label 
                        key={plan._id}
                        className={`block cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                          selectedPlan === plan._id ? 'bg-[#10B981]/10 border-[#10B981]' : 'bg-[#080D12] border-[#263241]'
                        }`}
                        onClick={() => setSelectedPlan(plan._id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === plan._id ? 'border-[#10B981]' : 'border-[#64748B]'}`}>
                            {selectedPlan === plan._id && <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>}
                          </div>
                          <span className="font-bold text-[#F8FAFC] text-sm leading-tight line-clamp-1">{plan.dishName}</span>
                        </div>
                        <div className="flex justify-between items-end mt-2 ml-8">
                           <span className="font-black text-[#10B981] text-lg">₹{plan.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={!selectedPlan}
                    className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#263241] disabled:text-[#64748B] text-[#080D12] font-black text-lg py-4 rounded-xl transition-all"
                  >
                    Add to Cart
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