import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Si pas connecté, on renvoie vers le login
    return <Navigate to="/login" replace />;
  }

  // Si connecté, on affiche la page protégée
  return children;
};

export default ProtectedRoute;