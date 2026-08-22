import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Local storage se purana cart load karein
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('homefeast_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Jab bhi cart change ho, usey Local Storage mein save karein
  useEffect(() => {
    localStorage.setItem('homefeast_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. 🟢 SMART ADD TO CART (Handles Quantities)
  const addToCart = (dish, kitchenName) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === dish._id);
      
      if (existingItem) {
        toast.success(`Increased ${dish.name} quantity! 🛒`, {
          style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
        });
        // Agar pehle se hai, toh sirf quantity badhao
        return prevItems.map((item) =>
          item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        toast.success(`${dish.name} added to cart! 🛒`, {
          style: { background: '#10B981', color: '#080D12', fontWeight: 'bold' }
        });
        // Agar naya hai, toh quantity 1 ke sath add karo
        return [...prevItems, { ...dish, quantity: 1, kitchen: kitchenName }];
      }
    });
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

  // 7. 🧮 SMART CALCULATIONS (For Cart Page and Navbar)
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