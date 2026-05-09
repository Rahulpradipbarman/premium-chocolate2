import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('luxeUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('luxeToken') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('luxeToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup Axios interceptor immediately if token exists from local storage
    if (token) {
      axios.interceptors.request.use(
        config => {
          config.headers['Authorization'] = `Bearer ${token}`;
          return config;
        },
        error => Promise.reject(error)
      );
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('luxeToken', newToken);
    localStorage.setItem('luxeUser', JSON.stringify(userData));
    
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
    localStorage.removeItem('luxeToken');
    localStorage.removeItem('luxeUser');
    localStorage.removeItem('luxeNoirCart'); // Clears cart for next person
    
    // Clear interceptor or force reload
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
