import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  const effectiveUser = user || (() => {
    const stored = localStorage.getItem('user');
    if (!stored || stored === 'undefined') return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  })();

  if (!isAuthenticated && !accessToken) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && effectiveUser?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;