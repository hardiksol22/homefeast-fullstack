import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      // 🟢 SMART DEBUG: Browser console mein F12 dabakar response dekh sakte hain
      console.log("Backend Login Response:", data); 

      if (response.ok) {
        // 🟢 FIX: Safe Data Extraction (Backend se data kisi bhi format me aaye, crash nahi hoga)
        const userData = data.user || data.data || data; 
        const userToken = data.token || userData.token;
        const userName = userData?.name ? userData.name.split(' ')[0] : 'User';
        const userRole = userData?.role || 'customer';

        // 1. Context me user aur token save karein
        login(userData, userToken);

        toast.success(`Welcome back, ${userName}! 🚀`, {
          style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
        });
        
        // 2. Smart Routing: Role ke hisaab se redirect
        if (userRole === 'cook') {
          navigate('/cook'); // Chef ko seedha dashboard par
        } else {
          navigate('/explore'); // Customer ko menu par
        }
      } else {
        toast.error(data.message || "Invalid email or password! ❌", {
          style: { background: '#F43F5E', color: '#fff', fontWeight: 'bold' }
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 🌟 Universal Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F4B942]/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite_reverse]"></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 transform transition-all duration-300 hover:border-[#10B981]/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
        
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black tracking-tighter text-[#F8FAFC] inline-block mb-3 hover:scale-105 transition-transform">
            Home<span className="text-[#10B981]">Feast</span>.
          </Link>
          <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
          <p className="text-[#94A3B8] text-sm">Sign in to continue your delicious journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="relative group">
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              className="peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[#10B981] transition-all placeholder-transparent shadow-inner" 
              placeholder="Email Address" 
            />
            <label 
              htmlFor="email" 
              className="absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#10B981]"
            >
              Email Address
            </label>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              id="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              className="peer w-full px-4 pt-6 pb-2 pr-12 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[#10B981] transition-all placeholder-transparent shadow-inner" 
              placeholder="Password" 
            />
            <label 
              htmlFor="password" 
              className="absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#10B981]"
            >
              Password
            </label>
            
            {/* 👁️ Eye Icon Toggle */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#10B981] transition-colors focus:outline-none p-1"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-[#263241] bg-[#080D12] text-[#10B981] focus:ring-[#10B981] focus:ring-offset-[#080D12]" />
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider group-hover:text-[#94A3B8] transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider hover:text-[#059669] transition-colors">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-[#10B981] text-[#080D12] font-black text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] flex justify-center items-center gap-2 disabled:opacity-70 disabled:transform-none mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#080D12]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Authenticating...
              </>
            ) : (
              'Sign In 🚀'
            )}
          </button>
        </form>

        <p className="text-center text-[#94A3B8] mt-8 text-sm">
          New to HomeFeast? <Link to="/register" className="text-[#F4B942] font-bold hover:underline transition-colors">Create an account</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;