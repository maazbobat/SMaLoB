import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Homepage from './components/Homepage';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './components/VerifyEmail'; // Create this component
import Unauthorized from './components/Unauthorized'; // Create this component

function App() {
  return (
    <AuthProvider>
      <Router>
        <main className="flex-shrink-0">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            </Route>

            {/* Catch-all routes */}
            <Route path="/404" element={<div>Page Not Found</div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;