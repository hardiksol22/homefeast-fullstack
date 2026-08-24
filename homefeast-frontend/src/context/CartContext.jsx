import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 🟢 NAYA: Logged-in user ka token nikal rahe hain
  const { user } = useAuth();
  const token = user?.token || user?.user?.token;

  // 1. Local storage se purana cart load karein
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('homefeast_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Jab bhi cart change ho, usey Local Storage mein save karein
  useEffect(() => {
    localStorage.setItem('homefeast_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. 🟢 SMART ADD TO CART (Backend API + Local Storage Sync)
  const addToCart = async (dish, kitchenName) => {
    if (!token) {
      toast.error("Please Sign In to add items to cart! 🍔");
      return;
    }

    const toastId = toast.loading("Adding to cart...");

    try {
      // 🚨 NAYA: Backend ko bata rahe hain ki cart update karo (Aur token bhej rahe hain)
      const response = await fetch('https://homefeast-fullstack.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- YEH ERROR FIX KAREGA!
        },
        body: JSON.stringify({ dishId: dish._id, quantity: 1 })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to database");
      }

      // 🟢 Agar backend me success ho gaya, tabhi frontend/local storage update karo
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === dish._id);
        
        if (existingItem) {
          toast.success(`Increased ${dish.name} quantity! 🛒`, {
            id: toastId,
            style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
          });
          return prevItems.map((item) =>
            item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast.success(`${dish.name} added to cart! 🛒`, {
            id: toastId,
            style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
          });
          return [...prevItems, { ...dish, quantity: 1, kitchen: kitchenName }];
        }
      });

    } catch (error) {
      console.error("Cart Add Error:", error);
      toast.error(error.message || "Server Error", { id: toastId });
    }
  };

  // 4. 🎛️ UPDATE QUANTITY (+ OR -)
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  // 5. 🗑️ REMOVE ITEM
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    toast.success("Item removed from cart! 🗑️", {
      style: { background: '#111827', color: '#F8FAFC' }
    });
  };

  // 6. 🧹 CLEAR CART (After Order)
  const clearCart = () => {
    setCartItems([]);
  };

  // 7. 🧮 SMART CALCULATIONS
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity, 
        removeItem, 
        clearCart, 
        cartCount, 
        itemTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};