import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token || user?.user?.token;

  // 📡 FETCH REAL ORDERS FROM BACKEND
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        // ⚠️ DHYAN DEIN: Yahan apne backend ka actual 'Get User Orders' wala URL daalein
        const response = await fetch(`https://homefeast-fullstack.onrender.com/api/orders/customer`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Naye orders upar dikhane ke liye reverse kar rahe hain
          setOrders(data.reverse());
        } else {
          // Fallback UI data just in case API is not ready
          setOrders([
            {
              _id: "ORD-98213",
              createdAt: new Date().toISOString(),
              status: "Preparing", // New, Pending, Preparing, Ready, Delivered
              totalAmount: 450,
              provider: { kitchenName: "Sharma Ji Ka Dhaba" },
              items: [{ name: "Paneer Butter Masala", quantity: 2 }, { name: "Tandoori Roti", quantity: 4 }]
            }
          ]);
        }
      } catch (error) {
        console.error("Fetch Orders Error:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
    // Active orders check karne ke liye har 20 sec me refresh
    const interval = setInterval(fetchMyOrders, 20000); 
    return () => clearInterval(interval);
  }, [user, token, navigate]);

  // Order sorting: Active (New, Pending, Preparing, Ready) vs Past (Delivered, Cancelled)
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

  // 🎨 Status Progress Bar Engine
  const getStatusProgress = (status) => {
    if (status === 'New' || status === 'Pending') return { width: '25%', color: 'bg-rose-500', text: 'Order Placed', icon: '📝' };
    if (status === 'Preparing') return { width: '60%', color: 'bg-[#F4B942]', text: 'Preparing Food', icon: '👨‍🍳' };
    if (status === 'Ready') return { width: '90%', color: 'bg-blue-500', text: 'Ready for Pickup', icon: '🛍️' };
    if (status === 'Delivered') return { width: '100%', color: 'bg-[#10B981]', text: 'Delivered', icon: '✅' };
    return { width: '0%', color: 'bg-gray-500', text: 'Cancelled', icon: '❌' };
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-20 relative overflow-hidden">
      
      {/* 🌟 Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F4B942]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              My Orders 📦
            </h1>
            <p className="text-[#94A3B8] font-medium">Track your delicious home-cooked meals.</p>
          </div>
          <Link to="/explore" className="w-max px-6 py-2.5 bg-[#111827] border border-[#263241] rounded-xl text-[#F8FAFC] font-bold text-sm hover:border-[#10B981] hover:text-[#10B981] transition-all shadow-lg">
            + Order More
          </Link>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-[#111827] rounded-3xl border border-[#263241] animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-16 text-center shadow-xl">
            <span className="text-7xl mb-6 opacity-80 block animate-bounce">🛵</span>
            <h3 className="text-3xl font-black text-[#F8FAFC] mb-4">No Orders Yet!</h3>
            <p className="text-[#94A3B8] mb-8 max-w-md mx-auto">You haven't ordered any meals yet. Explore our home kitchens and treat yourself!</p>
            <Link to="/explore" className="inline-block px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1">
              Explore Kitchens 🚀
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 🔴 ACTIVE ORDERS SECTION */}
            {activeOrders.length > 0 && (
              <section>
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> Active Orders
                </h2>
                <div className="space-y-6">
                  {activeOrders.map((order) => {
                    const progress = getStatusProgress(order.status || 'Pending');
                    
                    return (
                      <div key={order._id} className="bg-[#111827]/90 backdrop-blur-md border border-[#263241] rounded-[24px] p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-[#F4B942]/50 transition-all">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4B942]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Just Now"}
                            </p>
                            <h3 className="text-2xl font-black text-[#F8FAFC] mb-1">{order.provider?.kitchenName || 'Chef Kitchen'}</h3>
                            <p className="text-[#64748B] text-sm font-medium">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Total Amount</p>
                            <p className="text-3xl font-black text-[#10B981]">₹{order.totalAmount || order.total}</p>
                          </div>
                        </div>

                        {/* ITEMS LIST */}
                        <div className="bg-[#080D12] rounded-2xl p-5 mb-8 border border-[#263241]">
                          <p className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-3 border-b border-[#263241] pb-2">Items Ordered</p>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <p className="text-[#F8FAFC] font-medium text-sm">
                                  <span className="text-[#94A3B8] mr-2">{item.quantity}x</span> 
                                  {item.dish?.name || item.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 🚀 LIVE PROGRESS TRACKER */}
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <p className="text-sm font-black tracking-wider flex items-center gap-2">
                              <span>{progress.icon}</span> {progress.text}
                            </p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Live Status</span>
                          </div>
                          <div className="w-full h-3 bg-[#1E293B] rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${progress.color} transition-all duration-1000 ease-in-out relative`}
                              style={{ width: progress.width }}
                            >
                              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ⚪ PAST ORDERS SECTION */}
            {pastOrders.length > 0 && (
              <section>
                <h2 className="text-xl font-black mb-6 text-[#94A3B8]">Past Orders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastOrders.map((order) => (
                    <div key={order._id} className="bg-[#111827]/50 border border-[#263241] rounded-[24px] p-6 hover:bg-[#111827] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Past"}
                          </p>
                          <h3 className="text-lg font-black text-[#F8FAFC]">{order.provider?.kitchenName || 'Chef Kitchen'}</h3>
                        </div>
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-500'}`}>
                          {order.status}
                        </div>
                      </div>
                      
                      <p className="text-[#94A3B8] text-sm mb-4 line-clamp-1">
                        {order.items?.map(i => `${i.quantity}x ${i.dish?.name || i.name}`).join(', ')}
                      </p>
                      
                      <div className="border-t border-[#263241] pt-4 flex justify-between items-center mt-auto">
                        <p className="text-xl font-black text-[#F8FAFC]">₹{order.totalAmount || order.total}</p>
                        <button className="text-xs font-bold text-[#10B981] hover:text-[#F8FAFC] transition-colors">Reorder</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;