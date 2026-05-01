import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
