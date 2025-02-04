import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin-specific content */}
    </div>
  );
};

export default AdminDashboard;