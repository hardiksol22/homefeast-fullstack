import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#080D12] flex items-center justify-center text-[#10B981]">Loading...</div>;
  }

  // If user is not logged in, send them to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Check if user has the correct role (e.g., stopping a customer from opening the admin panel)
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // If logged in and role is correct, show the component
  return children;
};

export default ProtectedRoute;