import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null); 

  // ⚠️ Temporary dummy User ID jo aapne cart/orders me use ki thi
  const userId = "64f1b2c3d4e5f6a7b8c9d0e1"; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://homefeast-fullstack.onrender.com/api/payment/orders/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        toast.error("Could not load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // 🛑 CANCEL ORDER & REFUND FUNCTION
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? The amount will be refunded to your bank account.")) return;
    
    setCancelling(orderId);
    const toastId = toast.loading("Initiating refund...");

    try {
      const res = await fetch('https://homefeast-fullstack.onrender.com/api/payment/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: toastId });
        // UI ko turant update karenge 'Cancelled' aur 'Refunded' show karne ke liye
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'Cancelled', paymentStatus: 'Refunded' } : order
        ));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to cancel order", { id: toastId });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-32 pb-20 relative overflow-hidden">
      {/* 🌟 Ambient Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black mb-10 flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-2xl">📦</span>
          My Orders
        </h1>

        {loading ? (
          <div className="text-center py-20 text-[#94A3B8] font-bold animate-pulse">
            Loading your delicious history... 🍕
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] border border-[#263241] rounded-3xl shadow-xl">
            <span className="text-6xl mb-6 opacity-80 block">🍽️</span>
            <h3 className="text-2xl font-black text-[#F8FAFC] mb-3">No orders yet!</h3>
            <p className="text-[#94A3B8] mb-6">Looks like you haven't tasted our magic yet.</p>
            <Link to="/explore" className="px-8 py-4 bg-[#10B981] text-[#080D12] font-black rounded-xl hover:bg-[#059669] transition-all">
              Explore Kitchens
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#111827] border border-[#263241] p-6 rounded-3xl shadow-lg transition-all hover:border-[#10B981]/50 relative">
                
                {/* 🛑 CANCEL BUTTON (Ab yeh har active order par dikhega jab tak wo already Cancelled ya Delivered na ho) */}
                {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                  <button 
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancelling === order._id}
                    className="absolute top-6 right-6 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                  >
                    {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-[#263241] pb-4 pr-32">
                  <div>
                    <p className="text-[12px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Order ID: {order._id}</p>
                    <p className="text-[#F8FAFC] font-medium">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${
                      order.orderStatus === 'Placed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      order.orderStatus === 'Delivered' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 
                      order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${
                       order.paymentStatus === 'Refunded' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                       'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                    }`}>
                      {order.paymentStatus || "Paid"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center opacity-90">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#1E293B] flex justify-center items-center font-black text-xs text-[#94A3B8]">{item.quantity}x</span>
                        <span className="font-bold text-[#E2E8F0]">{item.name}</span>
                      </div>
                      <span className="font-medium text-[#94A3B8]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#263241] flex justify-between items-center">
                  <span className="text-[#94A3B8] font-medium">Total Billed Amount</span>
                  <span className="text-2xl font-black text-[#F8FAFC]">₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;