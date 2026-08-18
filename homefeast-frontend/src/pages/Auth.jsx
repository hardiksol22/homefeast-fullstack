import { useState } from 'react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // 'customer' or 'cook'

  return (
    <div className="min-h-screen bg-[#080D12] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F4B942]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
        
        {/* Top Header / Logo */}
        <div className="text-center pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#F8FAFC]">Home</span>
              <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Feast</span>
            </span>
          </Link>
          <h2 className="text-[#E5E7EB] text-xl font-bold mt-4">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-[#94A3B8] text-sm mt-1">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Join our community of food lovers and makers.'}
          </p>
        </div>

        <div className="p-8 pt-4">
          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Role Selector (Only show on Sign Up) */}
            {!isLogin && (
              <div className="flex bg-[#080D12] p-1 rounded-xl border border-[#263241] mb-6">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    role === 'customer' 
                      ? 'bg-[#10B981] text-[#080D12] shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                      : 'text-[#94A3B8] hover:text-[#E5E7EB]'
                  }`}
                >
                  Order Food
                </button>
                <button
                  type="button"
                  onClick={() => setRole('cook')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    role === 'cook' 
                      ? 'bg-[#F4B942] text-[#080D12] shadow-[0_0_10px_rgba(244,185,66,0.3)]' 
                      : 'text-[#94A3B8] hover:text-[#E5E7EB]'
                  }`}
                >
                  Sell Food
                </button>
              </div>
            )}

            {/* Name Field (Only on Sign Up) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder={role === 'cook' ? "e.g. Aunty's Kitchen" : "e.g. Rahul Sharma"}
                  className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs font-semibold text-[#10B981] hover:text-[#34D399] transition-colors">Forgot Password?</a>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-lg py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 mt-4">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center border-t border-[#263241] pt-6">
            <p className="text-sm text-[#94A3B8]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-[#10B981] hover:text-[#34D399] transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;