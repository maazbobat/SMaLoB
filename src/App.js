import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Homepage from './components/Homepage';
import AdminDashboard from './components/admin/AdminDashboard';
import VendorDashboard from './components/vendor/VendorDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './components/VerifyEmail';
import Unauthorized from './components/Unauthorized';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound'; // ✅ New NotFound page
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminUsers from './components/admin/AdminUsers';
import AdminVendors from './components/admin/AdminVendors';
import AdminSettings from './components/admin/AdminSettings';
import AdminProfile from './components/admin/AdminProfile';
import CustomerOrders from './components/customer/CustomerOrders';
import CustomerProfile from './components/customer/CustomerProfile';
import CustomerSettings from './components/customer/CustomerSettings';
import CustomerWishlist from './components/customer/CustomerWishlist';
import CustomerCart from './components/customer/CustomerCart';
import VendorProducts from './components/vendor/VendorProducts';
import VendorOrders from './components/vendor/VendorOrders';
import VendorProfile from './components/vendor/VendorProfile';
import VendorSettings from './components/vendor/VendorSettings';
import ProductDetails from './components/ProductDetails';
import CustomerCheckout from './components/customer/CustomerCheckout';



function App() {
  return (
    <AuthProvider>
      <Router>
        <main className="flex-shrink-0">
        <Routes>
  {/* ✅ Public Routes */}
  <Route path="/" element={<Homepage />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  <Route path="/verify-email/:token" element={<VerifyEmail />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />

  {/* ✅ Admin Routes */}
  <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/analytics" element={<AdminAnalytics />} />
    <Route path="/admin/vendors" element={<AdminVendors />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
    <Route path="/admin/profile" element={<AdminProfile />} />
  </Route>

  {/* ✅ Vendor Routes */}
  <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
    <Route path="/vendor/dashboard" element={<VendorDashboard />} />
    <Route path="/vendor/products" element={<VendorProducts />} />
    <Route path="/vendor/orders" element={<VendorOrders />} />
    <Route path="/vendor/profile" element={<VendorProfile />} />
    <Route path="/vendor/settings" element={<VendorSettings />} />

  </Route>

  {/* ✅ Customer Routes */}
  <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
    <Route path="/customer/orders" element={<CustomerOrders />} />
    <Route path="/customer/profile" element={<CustomerProfile />} />
    <Route path="/customer/settings" element={<CustomerSettings />} />
    <Route path="/customer/wishlist" element={<CustomerWishlist />} />
    <Route path="/customer/cart" element={<CustomerCart />} />
    <Route path="/checkout" element={<CustomerCheckout />} />
  </Route>

  {/* ✅ Catch-All Route */}
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;