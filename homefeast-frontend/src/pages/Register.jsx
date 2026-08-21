import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', // Default role customer rahega
    kitchenName: ''   // Cook ke liye extra field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔴 Validation: Agar Cook hai toh Kitchen Name zaroori hai
    if (formData.role === 'cook' && !formData.kitchenName.trim()) {
      toast.error("Please enter your Kitchen Name!", {
        style: { background: '#080D12', color: '#F4B942', border: '1px solid #F4B942' }
      });
      return;
    }

    setLoading(true);

    try {
      // 🟢 API Call to Backend
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) // Isme kitchenName automatically chala jayega
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.role === 'cook') {
          toast.success(`🎉 ${formData.kitchenName} Registered Successfully!`, {
            style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
          });
        } else {
          toast.success("Account Created! Please Sign In. 🎉", {
            style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
          });
        }
        // Registration ke baad seedha Login page par bhej do
        navigate('/login');
      } else {
        toast.error(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Server connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* 🌟 Background Glowing Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F4B942]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl p-8 rounded-[32px] border border-[#263241] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2">Join <span className="text-[#10B981]">HomeFeast</span></h2>
          <p className="text-[#94A3B8] text-sm font-medium">Create an account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 🎛️ ROLE SELECTION (Smart Toggle) */}
          <div className="flex bg-[#080D12] p-1.5 rounded-2xl border border-[#263241] mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer', kitchenName: '' })}
              className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${
                formData.role === 'customer' 
                  ? 'bg-[#10B981] text-[#080D12] shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'text-[#64748B] hover:text-[#F8FAFC]'
              }`}
            >
              Order Food 🍲
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'cook' })}
              className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${
                formData.role === 'cook' 
                  ? 'bg-[#F4B942] text-[#080D12] shadow-[0_0_15px_rgba(244,185,66,0.4)]' 
                  : 'text-[#64748B] hover:text-[#F8FAFC]'
              }`}
            >
              Sell Food 👨‍🍳
            </button>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              placeholder={formData.role === 'cook' ? "Chef's Full Name" : "Your Name"}
              className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
            />
          </div>

          {/* 🟢 SMART KITCHEN NAME INPUT (Only shows if role is 'cook') */}
          {formData.role === 'cook' && (
            <div className="animate-fade-in-up">
              <label className="block text-xs font-bold text-[#F4B942] uppercase tracking-wider mb-2">Kitchen Name 🏪</label>
              <input 
                type="text" name="kitchenName" required={formData.role === 'cook'}
                value={formData.kitchenName} onChange={handleChange}
                placeholder="e.g., Sharma Ji Ka Dhaba"
                className="w-full px-4 py-3.5 bg-[#F4B942]/5 border border-[#F4B942]/30 rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all shadow-[0_0_10px_rgba(244,185,66,0.1)]"
              />
              <p className="text-[10px] text-[#64748B] mt-1.5 ml-1">This name will be shown to customers.</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" name="password" required minLength="6"
              value={formData.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            className={`w-full py-4 text-[#080D12] font-black rounded-xl transition-all shadow-lg uppercase tracking-wider mt-4 ${
              formData.role === 'cook' 
                ? 'bg-[#F4B942] hover:bg-[#D9A02E] shadow-[0_0_20px_rgba(244,185,66,0.3)] hover:shadow-[0_0_30px_rgba(244,185,66,0.5)]' 
                : 'bg-[#10B981] hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
            }`}
          >
            {loading ? 'Creating Account...' : (formData.role === 'cook' ? 'Register Your Kitchen 🚀' : 'Create Account')}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-[#64748B] text-sm">
            Already have an account? <Link to="/login" className="text-[#10B981] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;