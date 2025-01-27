import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Homepage from './components/Homepage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to Signup */}
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute component={AdminDashboard} allowedRoles={['Admin']} />}
        />
      </Routes>
    </Router>
  );
}

export default App;