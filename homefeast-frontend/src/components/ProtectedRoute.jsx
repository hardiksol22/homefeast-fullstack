import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // 🟢 SMART ROLE CHECK: Taki nested object (user.user.role) bhi sahi se catch ho jaye
  const userRole = user?.role || user?.user?.role;

  if (!user) {
    // Agar user logged in hi nahi hai, toh seedha login pe bhejo (Bina kisi error ke)
    return <Navigate to="/login" replace />;
  }

  // Agar page kisi specific role ke liye hai aur user ka role match nahi karta
  if (allowedRole && userRole !== allowedRole) {
    
    // toast mein 'id' dene se React Strict Mode mein do-do baar popup nahi aayega!
    toast.error(`Unauthorized! Only ${allowedRole}s can access this page.`, { 
      id: 'role-error',
      style: { background: '#F43F5E', color: '#F8FAFC', fontWeight: 'bold' } 
    });
    
    // Agar user logged in hai par role galat hai, toh usko uske dashboard bhej do (Customer ko home pe, cook ko cook page pe)
    return <Navigate to="/" replace />;
  }

  // Sab theek hai toh page dikhao
  return children;
};

export default ProtectedRoute;