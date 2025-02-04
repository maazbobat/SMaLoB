import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'Customer') {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Customer Dashboard</h1>
      {/* Customer-specific content */}
    </div>
  );
};

export default CustomerDashboard;