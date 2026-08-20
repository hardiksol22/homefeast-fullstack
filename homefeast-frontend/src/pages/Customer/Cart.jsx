import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart } = useCart(); 

  // Total amount calculate karein
  const totalAmount = cart.reduce((total, item) => total + Number(item.price), 0);

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] pt-36 pb-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
          Your <span className="text-[#10B981]">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-[#111827] border border-[#263241] rounded-3xl p-12 text-center shadow-lg">
            <div className="w-24 h-24 bg-[#080D12] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#263241]">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Your cart is feeling light!</h2>
            <p className="text-[#94A3B8] mb-8">Good food is always cooking. Go ahead and add some delicious homemade meals.</p>
            <Link to="/explore" className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black px-8 py-3.5 rounded-full transition-transform hover:-translate-y-1">
              Explore Tiffins
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-[#111827] border border-[#263241] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 relative">
                  <div className="w-20 h-20 bg-[#080D12] rounded-xl flex items-center justify-center overflow-hidden">
                     <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"} alt={item.dishName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F8FAFC]">{item.dishName}</h3>
                    <p className="text-sm text-[#94A3B8]">from {item.kitchenName}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-[#F4B942] bg-[#F4B942]/10 px-2 py-1 rounded">{item.planType} Plan</span>
                  </div>
                  <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center mt-4 sm:mt-0">
                    <span className="text-xl font-black text-[#10B981]">₹{item.price}</span>
                    <button onClick={() => removeFromCart(item._id)} className="text-rose-500 hover:text-rose-400 text-sm font-bold mt-2 sm:mt-1 underline">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#111827] border border-[#263241] rounded-3xl p-6 shadow-xl sticky top-28">
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-6">Bill Details</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Item Total</span>
                    <span className="text-[#F8FAFC]">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Delivery Fee</span>
                    <span className="text-[#10B981]">FREE</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Platform Fee</span>
                    <span className="text-[#F8FAFC]">₹20</span>
                  </div>
                </div>

                <div className="border-t border-[#263241] pt-4 mb-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#F8FAFC]">To Pay</span>
                  <span className="text-2xl font-black text-[#10B981]">₹{totalAmount + 20}</span>
                </div>

                <button className="w-full bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:-translate-y-1">
                  Checkout Securely
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;