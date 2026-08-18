import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar user logged in nahi hai, toh login par bhej dein
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Status ke hisaab se color return karne ka function
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      case 'Pending': return 'bg-[#F4B942]/10 text-[#F4B942] border-[#F4B942]/30';
      case 'Completed': return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      default: return 'bg-[#263241] text-[#94A3B8] border-[#263241]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D12] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-10">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#F8FAFC] mb-2">
            My <span className="text-[#10B981]">Subscriptions</span>
          </h1>
          <p className="text-[#94A3B8] text-sm">Track and manage your daily tiffin orders.</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#111827] border border-[#263241] rounded-3xl p-12 text-center shadow-xl">
            <svg className="w-20 h-20 text-[#64748B] mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">No Active Subscriptions</h3>
            <p className="text-[#94A3B8] mb-8 max-w-md mx-auto">You haven't subscribed to any tiffin plans yet. Discover delicious homemade meals near you!</p>
            <Link to="/customer" className="inline-block bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-lg px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 transform hover:-translate-y-1">
              Find Tiffins
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#111827] border border-[#263241] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#10B981]/30 transition-colors shadow-lg">
                
                {/* Left Side: Order Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#F8FAFC]">{order.cook?.name || 'Home Cook'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#94A3B8] mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Order ID: #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#CBD5E1]">
                    <span className="font-semibold text-[#F8FAFC]">Plan:</span> {order.plan} • <span className="font-semibold text-[#F8FAFC]">Delivery:</span> {order.deliveryAddress}
                  </p>
                </div>

                {/* Right Side: Price & Actions */}
                <div className="text-left md:text-right w-full md:w-auto border-t border-[#263241] md:border-t-0 pt-4 md:pt-0">
                  <div className="text-2xl font-black text-[#F4B942] mb-3">
                    ₹{order.totalAmount}
                  </div>
                  <button className="w-full md:w-auto px-6 py-2 bg-[#080D12] hover:bg-[#263241] border border-[#263241] text-[#E5E7EB] font-semibold text-sm rounded-xl transition-colors">
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;