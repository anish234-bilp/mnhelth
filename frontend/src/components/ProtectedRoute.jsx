import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { owner } = useAuth();
  return owner ? children : <Navigate to="/owner/login" replace />;
};

export default ProtectedRoute;