import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, user, token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('luxeNoirCart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isInitialMount = useRef(true);

  // Load user cart on login
  useEffect(() => {
    if (isLoggedIn && user && user.cart) {
      setCartItems(user.cart);
    }
  }, [isLoggedIn, user]);

  // Sync to local storage and backend on changes
  useEffect(() => {
    localStorage.setItem('luxeNoirCart', JSON.stringify(cartItems));
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isLoggedIn && token) {
      // Axios interceptor inside AuthContext already attaches token,
      // but to be safe, if using axios directly here without waiting for interceptor setup,
      // we can just rely on the global interceptor.
      axios.post('http://localhost:5000/api/user/cart', { cart: cartItems })
        .catch(err => console.error('Failed to sync cart:', err));
    }
  }, [cartItems, isLoggedIn, token]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };
  
  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
