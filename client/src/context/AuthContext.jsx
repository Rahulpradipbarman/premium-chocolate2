import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, we might keep the token in memory, 
    // but on refresh, we'd lose it unless we have an httpOnly cookie.
    // Since the instruction says "Store JWT token in memory (not localStorage)", 
    // it implies it will reset on reload.
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
    
    // Setup Axios interceptor to attach token automatically
    axios.interceptors.request.use(
      config => {
        if (newToken) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
