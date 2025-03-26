// ✅ Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { FiUser, FiMail, FiLock, FiSmartphone } from "react-icons/fi";
import api from "../api/api";
import Footer from "./Footer";
import Navigation from "./Navbar";
import "../styles/styles.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Customer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
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
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#FF5A4E' }}>Join SMaLoB</h2>
            <p className="text-muted">Create your account to get started</p>
          </div>
          <Form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow">
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">{success}</Alert>}
            <FloatingLabel controlId="name" label="Full Name" className="mb-3">
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required className="border-2 py-3" />
              <FiUser className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <FloatingLabel controlId="username" label="Username" className="mb-3">
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required className="border-2 py-3" />
            </FloatingLabel>
            <FloatingLabel controlId="email" label="Email Address" className="mb-3">
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className="border-2 py-3" />
              <FiMail className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <FloatingLabel controlId="phone" label="Phone Number" className="mb-3">
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="border-2 py-3" />
              <FiSmartphone className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password" className="mb-3">
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" className="border-2 py-3" />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-4">
              <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="border-2 py-3" />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3 text-warning" />
            </FloatingLabel>
            <Form.Group className="mb-4">
              <Form.Label className="text-muted">Account Type</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange} required className="form-select-lg border-2">
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="w-100 py-3 fw-bold border-0" style={{ backgroundColor: '#FF5A4E' }}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-center mt-4 mb-0">
              Already have an account? <Link to="/login" className="fw-bold" style={{ color: '#FF5A4E' }}>Sign in here</Link>
            </p>
          </Form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Signup;
