import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Local storage se purana cart load karein taaki refresh karne par data na ude
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('homefeast_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Jab bhi cart change ho, usey Local Storage mein save karein
  useEffect(() => {
    localStorage.setItem('homefeast_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, kitchenName) => {
    const exists = cart.find((cartItem) => cartItem._id === item._id);
    if (exists) {
      toast.error("Item is already in your cart!");
      return;
    }
    setCart([...cart, { ...item, kitchenName }]);
    toast.success(`${item.dishName} added to cart! 🛒`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
    toast.success("Item removed from cart!");
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};