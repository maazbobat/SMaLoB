import React from 'react';
import { Navigate } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Navigate to="/login" replace />
    </div>
  );
};

export default Unauthorized;
