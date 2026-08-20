import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'customer' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password Strength Checker Logic
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10 || !/\d/.test(pass)) return { score: 2, label: 'Medium', color: 'bg-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-[#10B981]' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auth Context me user ko save karega
        login(data);
        toast.success('Account created successfully! Welcome to HomeFeast 🎉');
        
        // 🟢 THE STRICT FLOW LOGIC (Role based redirection)
        if (formData.role === 'cook' || data.role === 'cook') {
          navigate('/cook'); // Cook naya account banate hi seedha Kitchen Admin par
        } else {
          navigate('/explore'); // Customer seedha Explore par
        }
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex flex-col justify-center py-12 pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#10B981]/30">
      
      {/* 🌟 Glowing Background Ambient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#F4B942]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#263241] mb-6 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          <span className="text-xs font-bold text-[#CBD5E1] uppercase tracking-widest">
            Join 10k+ Foodies & Cooks
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#F8FAFC]">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981]">Account</span>
        </h2>
        <p className="mt-3 text-sm text-[#94A3B8] max-w-xs mx-auto font-medium">
          Start ordering authentic daily tiffins or share your home-cooked magic with the city.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
        <div className="bg-[#111827]/90 backdrop-blur-xl py-8 px-5 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#263241] rounded-3xl relative">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* 🎛️ STEP 1: INTERACTIVE ROLE SELECTOR CARDS */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3 ml-1">
                Select Your Account Type
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Customer Option */}
                <div 
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative flex flex-col items-center text-center group ${
                    formData.role === 'customer'
                      ? 'bg-[#10B981]/15 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-[#080D12] border-[#263241] hover:border-[#64748B] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                    formData.role === 'customer' ? 'bg-[#10B981] text-[#080D12]' : 'bg-[#263241] text-[#F8FAFC]'
                  }`}>
                    <span className="text-xl">🍲</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#F8FAFC]">Order Food</span>
                  <span className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">I want fresh meals</span>
                  
                  {formData.role === 'customer' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#10B981]"></div>
                  )}
                </div>

                {/* Cook Option */}
                <div 
                  onClick={() => setFormData({ ...formData, role: 'cook' })}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative flex flex-col items-center text-center group ${
                    formData.role === 'cook'
                      ? 'bg-[#F4B942]/15 border-[#F4B942] shadow-[0_0_20px_rgba(244,185,66,0.2)]' // Cook ke liye alag color vibe
                      : 'bg-[#080D12] border-[#263241] hover:border-[#64748B] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                    formData.role === 'cook' ? 'bg-[#F4B942] text-[#080D12]' : 'bg-[#263241] text-[#F8FAFC]'
                  }`}>
                    <span className="text-xl">👨‍🍳</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#F8FAFC]">Sell Food</span>
                  <span className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">I am a Home Cook</span>

                  {formData.role === 'cook' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F4B942]"></div>
                  )}
                </div>

              </div>
            </div>

            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all text-sm font-medium"
              />
            </div>

            {/* PASSWORD WITH EYE TOGGLE & STRENGTH BAR */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Password
                </label>
                {strength.label && (
                  <span className={`text-[11px] font-bold ${
                    strength.score === 1 ? 'text-rose-400' : strength.score === 2 ? 'text-amber-400' : 'text-[#10B981]'
                  }`}>
                    {strength.label}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all text-sm font-medium pr-12"
                />
                
                {/* Eye Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748B] hover:text-[#F8FAFC] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.972 8.972 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.748-1.748a3.5 3.5 0 01-4.95-4.95" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Dynamic Password Strength Bar */}
              {formData.password && (
                <div className="w-full bg-[#080D12] h-1.5 rounded-full mt-2 overflow-hidden border border-[#263241]">
                  <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#263241] disabled:text-[#64748B] text-[#080D12] font-black text-base rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#080D12] border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Get Started Free 🚀'
              )}
            </button>
          </form>

          {/* FOOTER SWITCH LINK */}
          <div className="mt-8 text-center pt-6 border-t border-[#263241]/60">
            <p className="text-sm text-[#94A3B8]">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-[#10B981] hover:text-[#34D399] transition-colors underline underline-offset-4">
                Sign in instead
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;