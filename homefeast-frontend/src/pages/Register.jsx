import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', 
    kitchenName: ''   
  });
  
  const [loading, setLoading] = useState(false);
  const [passStrength, setPassStrength] = useState(0);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  // 🛡️ SMART PASSWORD STRENGTH CALCULATOR
  useEffect(() => {
    let strength = 0;
    const pass = formData.password;
    if (pass.length > 5) strength += 25;
    if (pass.length > 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPassStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Smart Validation before calling API
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!", { style: { background: '#F43F5E', color: '#fff' } });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome to HomeFeast, ${formData.name.split(' ')[0]}! 🎉`, {
          style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
        });
        
        // Agar aapka API token return karta hai, toh auto-login karwa lijiye (Optional)
        // if(data.token) login(data.user, data.token); 
        
        if (formData.role === 'cook') {
          toast.success("Your kitchen is ready! Setup your menu now. 🍳", { icon: '👨‍🍳' });
          navigate('/login'); // Ya '/cook' agar auto-login enabled hai
        } else {
          navigate('/login'); // Ya '/explore' agar auto-login enabled hai
        }
      } else {
        toast.error(data.message || "Registration failed. Email might be in use.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  // UI Helpers for Password Meter
  const getMeterColor = () => {
    if (passStrength <= 25) return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
    if (passStrength <= 75) return 'bg-[#F4B942] shadow-[0_0_10px_rgba(244,185,66,0.5)]';
    return 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  };
  const getMeterLabel = () => {
    if (formData.password.length === 0) return 'Enter a password';
    if (passStrength <= 25) return 'Weak';
    if (passStrength <= 75) return 'Good';
    return 'Strong 🔥';
  };

  return (
    <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 🌟 Dynamic Ambient Glows based on Role */}
      <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${formData.role === 'cook' ? 'bg-[#F4B942]/10' : 'bg-[#10B981]/10'}`}></div>
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${formData.role === 'cook' ? 'bg-[#F4B942]/5' : 'bg-[#10B981]/5'}`}></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 transform transition-all duration-300 hover:border-[#263241]/80">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black tracking-tighter text-[#F8FAFC] inline-block mb-3 hover:scale-105 transition-transform">
            Home<span className={formData.role === 'cook' ? 'text-[#F4B942] transition-colors' : 'text-[#10B981] transition-colors'}>Feast</span>.
          </Link>
          <h2 className="text-2xl font-bold mb-2">Join the Community</h2>
          <p className="text-[#94A3B8] text-sm">Experience the best home-cooked meals.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 🎚️ SMART SEGMENTED CONTROL */}
          <div className="relative flex p-1 bg-[#080D12] rounded-xl border border-[#263241] mb-8">
            {/* Sliding Background Indicator */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-lg"
              style={{ 
                left: formData.role === 'customer' ? '4px' : 'calc(50%)',
                backgroundColor: formData.role === 'customer' ? '#10B981' : '#F4B942'
              }}
            ></div>
            
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer', kitchenName: '' })}
              className={`relative z-10 flex-1 py-3 text-sm font-black tracking-wide rounded-lg transition-colors duration-300 ${formData.role === 'customer' ? 'text-[#080D12]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              FOODIE 🍔
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'cook' })}
              className={`relative z-10 flex-1 py-3 text-sm font-black tracking-wide rounded-lg transition-colors duration-300 ${formData.role === 'cook' ? 'text-[#080D12]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              CHEF 👨‍🍳
            </button>
          </div>

          {/* Input Fields */}
          <div className="relative group">
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={`peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-transparent focus:ring-1 transition-all placeholder-transparent ${formData.role === 'cook' ? 'focus:ring-[#F4B942]' : 'focus:ring-[#10B981]'}`} placeholder="Full Name" />
            <label htmlFor="name" className={`absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] ${formData.role === 'cook' ? 'peer-focus:text-[#F4B942]' : 'peer-focus:text-[#10B981]'}`}>Full Name</label>
          </div>

          <div className="relative group">
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={`peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-transparent focus:ring-1 transition-all placeholder-transparent ${formData.role === 'cook' ? 'focus:ring-[#F4B942]' : 'focus:ring-[#10B981]'}`} placeholder="Email Address" />
            <label htmlFor="email" className={`absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] ${formData.role === 'cook' ? 'peer-focus:text-[#F4B942]' : 'peer-focus:text-[#10B981]'}`}>Email Address</label>
          </div>

          <div className="relative group">
            <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className={`peer w-full px-4 pt-6 pb-2 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] focus:outline-none focus:border-transparent focus:ring-1 transition-all placeholder-transparent ${formData.role === 'cook' ? 'focus:ring-[#F4B942]' : 'focus:ring-[#10B981]'}`} placeholder="Password" />
            <label htmlFor="password" className={`absolute text-[11px] font-bold text-[#64748B] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px] ${formData.role === 'cook' ? 'peer-focus:text-[#F4B942]' : 'peer-focus:text-[#10B981]'}`}>Password</label>
          </div>

          {/* 🛡️ PASSWORD STRENGTH METER */}
          <div className="px-1 mt-1 mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Security</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${passStrength > 75 ? 'text-[#10B981]' : passStrength > 25 ? 'text-[#F4B942]' : 'text-[#64748B]'}`}>
                {getMeterLabel()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#080D12] rounded-full overflow-hidden border border-[#263241]">
              <div 
                className={`h-full transition-all duration-500 ease-out ${getMeterColor()}`}
                style={{ width: `${Math.max(passStrength, 5)}%` }}
              ></div>
            </div>
          </div>

          {/* 🟢 CONDITIONAL KITCHEN FIELD (SMART ANIMATION) */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${formData.role === 'cook' ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="relative group mt-2">
              <input type="text" name="kitchenName" id="kitchenName" required={formData.role === 'cook'} value={formData.kitchenName} onChange={handleChange} className="peer w-full px-4 pt-6 pb-2 bg-[#F4B942]/10 border border-[#F4B942]/30 rounded-xl text-[#F4B942] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942] transition-all placeholder-transparent font-bold" placeholder="Kitchen Name" />
              <label htmlFor="kitchenName" className="absolute text-[11px] font-bold text-[#F4B942] uppercase tracking-wider top-2 left-4 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[11px]">Your Kitchen Name 🍳</label>
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 font-black text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none mt-6 flex justify-center items-center gap-2 ${formData.role === 'cook' ? 'bg-[#F4B942] text-[#080D12] hover:bg-[#D9A02E] shadow-[0_0_20px_rgba(244,185,66,0.3)] hover:shadow-[0_10px_30px_rgba(244,185,66,0.5)]' : 'bg-[#10B981] text-[#080D12] hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)]'}`}>
            {loading ? <span className="animate-pulse">Setting up...</span> : formData.role === 'cook' ? 'Start Your Kitchen 🚀' : 'Start Ordering 🚀'}
          </button>
        </form>

        <p className="text-center text-[#94A3B8] mt-8 text-sm">
          Already a member? <Link to="/login" className={`font-bold hover:underline transition-colors ${formData.role === 'cook' ? 'text-[#F4B942]' : 'text-[#10B981]'}`}>Sign In here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;