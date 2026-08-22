import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// 🟢 REGULAR IMPORTS (Navbar, Footer, ProtectedRoute hamesha turant dikhne chahiye)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import KitchenMenu from './pages/KitchenMenu';

// 🚀 LAZY IMPORTS (Super Advanced Code-Splitting - Pages tabhi load honge jab unki zaroorat hogi)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CustomerDashboard = lazy(() => import('./pages/Customer/CustomerDashboard'));
const ProviderMenu = lazy(() => import('./pages/Customer/ProviderMenu'));
const Cart = lazy(() => import('./pages/Customer/Cart'));
const Orders = lazy(() => import('./pages/Customer/Orders'));
const Wishlist = lazy(() => import('./pages/Customer/Wishlist'));
const CookDashboard = lazy(() => import('./pages/Cook/CookDashboard'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Chefs = lazy(() => import('./pages/Customer/Chefs'));
const Offers = lazy(() => import('./pages/Customer/Offers'));

// 📜 SMART SCROLL-TO-TOP COMPONENT (Page badalne par hamesha top par le aayega)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// ✨ PREMIUM LOADING SCREEN (Jab tak lazy page load ho raha hai, yeh dikhega)
const PremiumLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#080D12] relative z-50">
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Outer Spinning Ring */}
      <div className="absolute inset-0 border-4 border-[#263241] border-t-[#10B981] border-r-[#F4B942] rounded-full animate-spin"></div>
      {/* Inner Pulsing Dot */}
      <div className="w-8 h-8 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
    </div>
    <p className="text-[#94A3B8] font-black tracking-[0.2em] uppercase text-xs mt-6 animate-pulse">
      Loading HomeFeast...
    </p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Smart Scroll Engine */}
          <ScrollToTop />

          {/* 🍞 Premium Dark Theme Toaster */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#111827',
                color: '#F8FAFC',
                border: '1px solid #263241',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#080D12' } },
              error: { iconTheme: { primary: '#F43F5E', secondary: '#080D12' } },
            }}
          />

          <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#10B981] selection:text-[#080D12]">
            
            <Navbar />

            {/* Dynamic Route Content wrapped in Suspense for Lazy Loading */}
            <main className="flex-1 relative">
              <Suspense fallback={<PremiumLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Open Customer Routes */}
                  <Route path="/explore" element={<CustomerDashboard />} />
                  <Route path="/customer" element={<CustomerDashboard />} />
                  <Route path="/provider/:id" element={<ProviderMenu />} />
                  <Route path="/chefs" element={<Chefs />} />
                  <Route path="/offers" element={<Offers />} />
                  
                  {/* 🔒 Protected Customer Routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute><Cart /></ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute><Orders /></ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute><Wishlist /></ProtectedRoute>
                  } />
                  
                  {/* 🔒 Protected Cook Routes */}
                  <Route path="/cook" element={
                    <ProtectedRoute allowedRole="cook"><CookDashboard /></ProtectedRoute>
                  } />
                  
                  {/* 🔒 Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
                  } />

                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFound />} />
                  <Route path="/provider/:id" element={<KitchenMenu />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}