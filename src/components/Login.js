// ✅ Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";
import Navigation from "./Navbar";
import "../styles/styles.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionExpired = searchParams.get("session_expired");
    if (sessionExpired) {
      setError("Your session has expired. Please log in again.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [location]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      const { token, role, name } = response.data;
      if (!token) {
        setError("Login failed. No token received.");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      login(token, role, name);
      const dashboardPaths = {
        Admin: "/admin/dashboard",
        Vendor: "/vendor/dashboard",
        Customer: "/customer/dashboard",
      };
      navigate(dashboardPaths[role] || "/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation isLoggedIn={false} userRole="guest" />
      <Container className="my-auto py-5">
        <div className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#FF5A4E" }}>Welcome Back</h2>
            <p className="text-muted">Sign in to your SMaLoB account</p>
          </div>
          <Form onSubmit={handleLoginSubmit} className="bg-white p-4 rounded-4 shadow">
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <FloatingLabel controlId="email" label="Email Address" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-2 py-3"
              />
              <FiMail className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password" className="mb-4">
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border-2 py-3"
              />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <Button type="submit" className="w-100 py-3 fw-bold border-0" style={{ backgroundColor: '#FF5A4E' }}>
              {loading ? "Authenticating..." : <><FiLogIn className="me-2" /> Sign In</>}
            </Button>
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-decoration-none small fw-bold" style={{ color: '#FF5A4E' }}>Forgot Password?</Link>
            </div>
            <p className="text-center mt-4 mb-0">
              Don't have an account? <Link to="/signup" className="fw-bold" style={{ color: '#FF5A4E' }}>Create Account</Link>
            </p>
          </Form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Login;