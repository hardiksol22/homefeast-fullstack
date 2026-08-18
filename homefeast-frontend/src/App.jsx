import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import ProviderDetails from './pages/Customer/ProviderDetails';
import Cart from './pages/Customer/Cart';
import Orders from './pages/Customer/Orders';
import Wishlist from './pages/Customer/Wishlist';
import CookDashboard from './pages/Cook/CookDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFound from './pages/NotFound';
import Categories from './pages/Customer/Categories';
import Chefs from './pages/Customer/Chefs';
import Offers from './pages/Customer/Offers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#080D12] text-[#F8FAFC] flex flex-col font-sans">
          
          <Navbar />

          {/* Dynamic Route Content */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Open Customer Routes (Discovery can be public) */}
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/provider/:id" element={<ProviderDetails />} />
              
              {/* Protected Customer Routes (Requires Login) */}
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><Wishlist /></ProtectedRoute>
              } />
              
              {/* Protected Cook Routes */}
              <Route path="/cook" element={
                <ProtectedRoute allowedRole="cook"><CookDashboard /></ProtectedRoute>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
              } />

              {/* Catch-all 404 Route (Must be at the very end) */}
              <Route path="*" element={<NotFound />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/chefs" element={<Chefs />} />
              <Route path="/offers" element={<Offers />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </Router>
    </AuthProvider>
  );
}