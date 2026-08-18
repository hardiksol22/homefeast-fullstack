import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // --- MOCK CART DATA ---
  const cartItem = {
    cookName: "Aunty's Authentic Kitchen",
    planName: "Monthly Subscription",
    price: 2500,
    meals: "24 Meals (Mon-Sat)",
    diet: "Pure Veg"
  };

  const platformFee = 50;
  const gst = Math.round(cartItem.price * 0.05); // 5% GST
  const total = cartItem.price + platformFee + gst;

  const [startDate, setStartDate] = useState('');

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] py-10 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC] mb-8">
          Checkout <span className="text-[#10B981]">Summary</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Delivery Details & Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Details Card */}
            <div className="bg-[#111827] border border-[#263241] rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Delivery Address</label>
                  <textarea 
                    rows="3"
                    placeholder="Enter your full address (Flat, Building, Street, Area)"
                    className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors resize-none text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Plan Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cart Item Card */}
            <div className="bg-[#111827] border border-[#263241] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-[60px] pointer-events-none"></div>

              <h2 className="text-xl font-bold text-[#F8FAFC] mb-6">Your Plan</h2>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#080D12] p-5 rounded-2xl border border-[#263241]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-[#F8FAFC]">{cartItem.planName}</h3>
                    <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      {cartItem.diet}
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-sm">By {cartItem.cookName}</p>
                  <p className="text-[#64748B] text-xs mt-2">Includes {cartItem.meals}</p>
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-black text-[#10B981]">₹{cartItem.price}</span>
                  <button className="block mt-2 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column: Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#111827] border border-[#263241] rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Plan Cost</span>
                  <span className="text-[#F8FAFC]">₹{cartItem.price}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Platform Fee</span>
                  <span className="text-[#F8FAFC]">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>GST (5%)</span>
                  <span className="text-[#F8FAFC]">₹{gst}</span>
                </div>
                
                {/* Divider */}
                <div className="h-[1px] w-full bg-[#263241] my-4"></div>
                
                <div className="flex justify-between items-end">
                  <span className="font-bold text-[#E5E7EB] text-base">Total Amount</span>
                  <span className="text-2xl font-black text-[#10B981]">₹{total}</span>
                </div>
              </div>

              {/* Secure Payment Note */}
              <div className="flex items-center gap-2 mb-6 text-xs text-[#64748B] bg-[#080D12] p-3 rounded-xl border border-[#263241]">
                <svg className="w-4 h-4 text-[#F4B942]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are 100% secure and encrypted.
              </div>

              <button className="w-full bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1">
                Proceed to Payment &rarr;
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;