import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log("🔍 Checking access for role:", user?.role);

  if (!user) {
    console.log("❌ User not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("🚫 Access denied for role:", user.role);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access granted. Rendering protected route.");
  return <Outlet />;
};

export default ProtectedRoute;