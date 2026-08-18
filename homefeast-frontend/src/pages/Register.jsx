import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Context Import Kiya

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Global login function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend par POST request bhej rahe hain
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Context mein user ko save karein (with token)
      login({ ...data.user, token: data.token });

      // Role ke hisaab se dashboard par bhej dein
      if (data.user.role === 'cook') {
        navigate('/cook');
      } else {
        navigate('/customer');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D12] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F4B942]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-[#263241] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 my-8">
        <div className="text-center pt-8 pb-4">
          <Link to="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#F8FAFC]">Home</span>
              <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Feast</span>
            </span>
          </Link>
          <h2 className="text-[#E5E7EB] text-xl font-bold mt-4">Create an Account</h2>
          <p className="text-[#94A3B8] text-sm mt-1">Join our community of food lovers and makers.</p>
        </div>

        <div className="p-8 pt-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 text-sm font-bold p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="flex bg-[#080D12] p-1 rounded-xl border border-[#263241] mb-6">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${role === 'customer' ? 'bg-[#10B981] text-[#080D12] shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-[#94A3B8] hover:text-[#E5E7EB]'}`}
              >
                Order Food
              </button>
              <button
                type="button"
                onClick={() => setRole('cook')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${role === 'cook' ? 'bg-[#F4B942] text-[#080D12] shadow-[0_0_10px_rgba(244,185,66,0.3)]' : 'text-[#94A3B8] hover:text-[#E5E7EB]'}`}
              >
                Sell Food
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={role === 'cook' ? "e.g. Aunty's Kitchen" : "e.g. Rahul Sharma"} className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 ml-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-3 bg-[#080D12] border border-[#263241] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-colors text-sm" />
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-[#10B981] hover:bg-[#059669] text-[#080D12] font-black text-base py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 mt-2 disabled:opacity-50">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#263241] pt-6">
            <p className="text-sm text-[#94A3B8]">
              Already have an account? <Link to="/login" className="ml-2 font-bold text-[#10B981] hover:text-[#34D399] transition-colors">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;