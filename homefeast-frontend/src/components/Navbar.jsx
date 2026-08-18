import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Context import kiya

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auth state extract ki
  const { user, logout } = useAuth();

  // Updated premium layout links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/customer' },
    { name: 'Categories', path: '/categories' },
    { name: 'Chefs', path: '/chefs' },
    { name: 'Offers', path: '/offers' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  // Listen for scroll to trigger the blur/transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
        scrolled 
          ? 'bg-[#080D12]/75 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#080D12]'
      }`}
    >
      {/* Premium Effect: Thin Gradient Line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#10B981] via-[#F4B942] to-[#F97316] opacity-30"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] flex-nowrap overflow-visible">
          
          {/* Brand Logo - Split Color Design */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 mr-6 group">
            <span className="text-[26px] font-black tracking-tight whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#F8FAFC]">Home</span>
              <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Feast</span>
            </span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 h-full items-center flex-nowrap mr-auto pl-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative group text-[15px] font-medium transition-all duration-300 h-full flex items-center whitespace-nowrap ${
                  isActive(link.path) 
                    ? 'text-[#10B981]' 
                    : 'text-[#CBD5E1] hover:text-[#10B981]'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-[4px] w-[4px] rounded-full bg-[#10B981] transition-all duration-300 ease-out ${
                  isActive(link.path) ? 'opacity-100 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 'opacity-0 group-hover:opacity-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Tools: Search, Wishlist, Cart, Account */}
          <div className="flex items-center gap-5 lg:gap-6 flex-nowrap">
            
            {/* Pill-shaped Search Box */}
            <div className="hidden lg:flex items-center relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search chefs, dishes..."
                className="block w-52 focus:w-64 pl-10 pr-4 py-2 border border-[#263241] rounded-full leading-5 bg-[#111827] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-all duration-300 ease-out"
              />
            </div>

            {/* Icons Group */}
            <div className="flex items-center gap-4 border-l border-[#263241] pl-6 ml-2">
              
              {/* Wishlist Icon */}
              <Link to="/wishlist" className="relative group cursor-pointer p-1">
                <svg className="w-[22px] h-[22px] text-[#F8FAFC] group-hover:text-[#10B981] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative group cursor-pointer p-1">
                <svg className="w-6 h-6 text-[#F4B942] group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_0_4px_rgba(244,185,66,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {user && (
                  <span className="absolute -top-0.5 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white ring-2 ring-[#080D12] shadow-[0_0_6px_rgba(249,115,22,0.6)]">
                    1
                  </span>
                )}
              </Link>

              {/* Dynamic Auth Button */}
              {user ? (
                <div className="relative group ml-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-[#080D12] transition-all duration-300 font-semibold text-sm whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hi, {user.name.split(' ')[0]}
                  </button>
                  
                  {/* Dropdown Menu (Appears on Hover) */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#263241] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right overflow-hidden">
                    <div className="p-3 border-b border-[#263241]">
                      <p className="text-xs text-[#94A3B8]">Signed in as</p>
                      <p className="text-sm font-bold text-[#F8FAFC] truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        to={user.role === 'admin' ? '/admin' : user.role === 'cook' ? '/cook' : '/orders'} 
                        className="block px-4 py-2 text-sm text-[#CBD5E1] hover:bg-[#263241] hover:text-[#10B981] transition-colors"
                      >
                        {user.role === 'cook' ? 'Kitchen Dashboard' : user.role === 'admin' ? 'Admin Panel' : 'My Subscriptions'}
                      </Link>
                      {user.role === 'customer' && (
                        <Link to="/customer" className="block px-4 py-2 text-sm text-[#CBD5E1] hover:bg-[#263241] hover:text-[#10B981] transition-colors">
                          Find Food
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-2 border-t border-[#263241]">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm font-bold text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-5 py-2 ml-2 rounded-full bg-[#10B981] text-[#080D12] hover:bg-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 font-bold text-sm whitespace-nowrap">
                  Sign In
                </Link>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;