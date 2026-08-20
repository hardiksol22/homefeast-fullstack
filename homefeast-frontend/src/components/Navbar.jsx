import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth(); 
  const { cart } = useCart(); 

  // 🧑‍💼 1. Customer Links (Normal Users)
  const customerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Chefs', path: '/chefs' },
  ];

  // 👨‍🍳 2. Cook Links (Sirf Admin/Dashboard Panel)
  const cookLinks = [
    { name: 'Kitchen Admin', path: '/cook' }
  ];

  // 👑 3. Main Admin Links (Super Admin)
  const adminLinks = [
    { name: 'Super Admin', path: '/admin' }
  ];

  // 🧠 Smart Logic: Decide which links to show based on Role
  let navLinks = customerLinks;
  if (user?.role === 'cook') navLinks = cookLinks;
  if (user?.role === 'admin') navLinks = adminLinks;

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-[#080D12]/75 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-[#080D12]'}`}>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#10B981] via-[#F4B942] to-[#F97316] opacity-30"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] flex-nowrap overflow-visible">
          
          {/* LOGO */}
          <Link to={user?.role === 'cook' ? '/cook' : '/'} className="flex-shrink-0 flex items-center gap-1 mr-8 group">
            <span className="text-[26px] font-black tracking-tight whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#F8FAFC]">Home</span>
              <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Feast</span>
              {/* Cook ke logo ke aage chhota sa badge */}
              {user?.role === 'cook' && <span className="ml-2 text-[10px] bg-[#263241] text-[#94A3B8] px-2 py-1 rounded-md align-middle uppercase tracking-widest">Partner</span>}
            </span>
          </Link>
          
          <div className="flex flex-1 items-center justify-end gap-6 xl:gap-8 flex-nowrap">
            
            {/* DYNAMIC NAV LINKS */}
            <nav className="hidden lg:flex space-x-5 xl:space-x-8 h-full items-center flex-nowrap">
              {navLinks.map((link, index) => (
                <Link key={index} to={link.path} className={`relative group text-[15px] font-medium transition-all duration-300 h-full flex items-center whitespace-nowrap ${isActive(link.path) ? 'text-[#10B981]' : 'text-[#CBD5E1] hover:text-[#10B981]'}`}>
                  {link.name}
                  <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-[4px] w-[4px] rounded-full bg-[#10B981] transition-all duration-300 ease-out ${isActive(link.path) ? 'opacity-100 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'opacity-0 group-hover:opacity-100'}`}></span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block h-6 w-[1px] bg-[#263241]"></div>

            <div className="flex items-center gap-4 xl:gap-5 flex-nowrap">
              
              {/* 🛑 HIDE SEARCH, WISHLIST & CART FOR COOKS & ADMINS */}
              {(!user || user.role === 'customer') && (
                <>
                  <div className="hidden xl:flex items-center relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-[#94A3B8] group-focus-within:text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input type="text" placeholder="Search chefs..." className="block w-48 focus:w-60 pl-10 pr-4 py-2 border border-[#263241] rounded-full bg-[#111827] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#10B981] text-sm transition-all" />
                  </div>

                  <Link to="/wishlist" className="relative group cursor-pointer p-1 hidden sm:block">
                    <svg className="w-[22px] h-[22px] text-[#F8FAFC] hover:text-[#10B981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>

                  <Link to="/cart" className="relative group cursor-pointer p-1 hidden sm:block">
                    <svg className="w-6 h-6 text-[#F4B942] hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cart.length > 0 && (
                      <span className="absolute -top-0.5 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white shadow-md">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* USER AUTH BUTTONS */}
              <div className="flex items-center gap-3 ml-2 border-l border-[#263241] pl-4 sm:pl-6">
                {user ? (
                  <>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-xs sm:text-sm border ${
                      user.role === 'cook' ? 'bg-[#F4B942]/10 text-[#F4B942] border-[#F4B942]/30' : 
                      user.role === 'admin' ? 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/30' :
                      'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                    }`}>
                      Hi, {user.name ? user.name.split(' ')[0] : 'User'} 
                      {user.role === 'cook' && ' 👨‍🍳'} 
                      {user.role === 'admin' && ' 👑'}
                    </div>
                    <button onClick={handleLogout} className="text-xs sm:text-sm font-bold text-rose-500 hover:text-rose-400">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#080D12] text-sm font-black rounded-full shadow-lg transition-transform hover:-translate-y-0.5">
                    Sign In
                  </Link>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;