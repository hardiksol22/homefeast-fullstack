import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        toast.success(`Welcome back, ${data.name ? data.name.split(' ')[0] : 'User'}! 🎉`);

        // 🟢 THE STRICT FLOW LOGIC: User ko uske role ke hisaab se sahi jagah bhejo
        if (data.role === 'cook') {
          navigate('/cook'); // Cook goes to Kitchen Admin
        } else if (data.role === 'admin') {
          navigate('/admin'); // Admin goes to Super Admin Panel
        } else {
          navigate('/explore'); // Customer goes to Food Discovery
        }
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Server error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex flex-col justify-center py-12 pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* 🌟 Glowing Background Ambient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#F8FAFC]">
          Welcome <span className="text-[#10B981]">Back</span>
        </h2>
        <p className="mt-3 text-sm text-[#94A3B8] font-medium">
          Sign in to your account to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-[#111827]/90 backdrop-blur-xl py-8 px-5 sm:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#263241] rounded-3xl relative">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] transition-all text-sm font-medium" />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-2xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] transition-all text-sm font-medium pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748B] hover:text-[#F8FAFC]">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" disabled={loading} className="w-full py-4 px-4 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#263241] text-[#080D12] font-black text-base rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5 mt-4">
              {loading ? 'Signing In...' : 'Sign In 🚀'}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 text-center pt-6 border-t border-[#263241]/60">
            <p className="text-sm text-[#94A3B8]">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-[#10B981] hover:text-[#34D399] transition-colors underline underline-offset-4">
                Sign up here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;