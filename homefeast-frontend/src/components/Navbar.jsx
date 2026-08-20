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

  // 🟢 SMART USER NAME FALLBACK FIX
  const displayName = user?.name || user?.user?.name || 'User';

  // Customer Nav Links
  const customerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Chefs', path: '/chefs' },
  ];

  // Cook Nav Links
  const cookLinks = [
    { name: 'Kitchen Admin', path: '/cook' }
  ];

  // Admin Nav Links
  const adminLinks = [
    { name: 'Super Admin', path: '/admin' }
  ];

  let navLinks = customerLinks;
  if (user?.role === 'cook' || user?.user?.role === 'cook') navLinks = cookLinks;
  if (user?.role === 'admin' || user?.user?.role === 'admin') navLinks = adminLinks;

  const isCook = user?.role === 'cook' || user?.user?.role === 'cook';
  const isAdmin = user?.role === 'admin' || user?.user?.role === 'admin';

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
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-[#080D12]/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]' : 'bg-[#080D12]'}`}>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#10B981] via-[#F4B942] to-[#F97316] opacity-30"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] flex-nowrap overflow-visible">
          
          {/* LOGO */}
          <Link to={isCook ? '/cook' : '/'} className="flex-shrink-0 flex items-center gap-1 group">
            <span className="text-[26px] font-black tracking-tight whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#F8FAFC]">Home</span>
              <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Feast</span>
              {isCook && <span className="ml-2 text-[10px] bg-[#F4B942]/10 border border-[#F4B942]/30 text-[#F4B942] px-2 py-0.5 rounded-md uppercase font-black tracking-widest">Partner</span>}
            </span>
          </Link>
          
          <div className="flex flex-1 items-center justify-end gap-5 xl:gap-8 flex-nowrap">
            
            {/* NAV LINKS */}
            <nav className="hidden lg:flex space-x-5 xl:space-x-8 h-full items-center flex-nowrap">
              {navLinks.map((link, index) => (
                <Link key={index} to={link.path} className={`relative group text-[15px] font-bold transition-all duration-300 h-full flex items-center whitespace-nowrap ${isActive(link.path) ? 'text-[#10B981]' : 'text-[#CBD5E1] hover:text-[#10B981]'}`}>
                  {link.name}
                  <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-[4px] w-[4px] rounded-full bg-[#10B981] transition-all duration-300 ${isActive(link.path) ? 'opacity-100 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'opacity-0 group-hover:opacity-100'}`}></span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block h-6 w-[1px] bg-[#263241]"></div>

            <div className="flex items-center gap-4 flex-nowrap">
              
              {/* 🛒 WISHLIST & CART (For Customers) */}
              {!isCook && !isAdmin && (
                <>
                  {/* Wishlist Button */}
                  <Link to="/wishlist" className="relative group p-2 rounded-xl bg-[#111827] border border-[#263241] hover:border-[#10B981]/50 transition-all">
                    <svg className="w-5 h-5 text-[#F8FAFC] group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>

                  {/* Cart Button with Animated Count */}
                  <Link to="/cart" className="relative group p-2 rounded-xl bg-[#111827] border border-[#263241] hover:border-[#10B981]/50 transition-all">
                    <svg className="w-5 h-5 text-[#F4B942] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cart && cart.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-[10px] font-black text-[#080D12] shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-bounce">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* USER AUTH & NAME BADGE */}
              <div className="flex items-center gap-3 border-l border-[#263241] pl-4">
                {user ? (
                  <>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm border ${
                      isCook ? 'bg-[#F4B942]/10 text-[#F4B942] border-[#F4B942]/30' : 
                      isAdmin ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                      'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                      <span>Hi, {displayName.split(' ')[0]}</span>
                      {isCook && ' 👨‍🍳'}
                    </div>
                    <button onClick={handleLogout} className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#080D12] text-xs font-black rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform hover:-translate-y-0.5 uppercase tracking-wider">
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