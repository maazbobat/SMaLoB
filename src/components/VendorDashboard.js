import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'Vendor') {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      {/* Vendor-specific content */}
    </div>
  );
};

export default VendorDashboard;