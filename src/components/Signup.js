import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Navbar, Nav, FloatingLabel, Alert } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiSmartphone } from 'react-icons/fi';
import api from '../api/api';
import Footer from './Footer';
import '../styles/styles.css';
import logo from "../assets/logo/logo_transparent.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'Customer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/signup', formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="navbar-custom shadow-sm" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="SMaLoB Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/Homepage">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/services">Services</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-auto py-5">
        <div className="mx-auto" style={{ maxWidth: '500px' }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#FF5A4E' }}>Join SMaLoB</h2>
            <p className="text-muted">Create your account to get started</p>
          </div>

          <Form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow">
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">{success}</Alert>}

            <FloatingLabel controlId="name" label="Full Name" className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiUser className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

            <FloatingLabel controlId="username" label="Username" className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
            </FloatingLabel>

            <FloatingLabel controlId="email" label="Email Address" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiMail className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

            <FloatingLabel controlId="phone" label="Phone Number" className="mb-3">
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiSmartphone className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password" className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

            <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-4">
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

            <Form.Group className="mb-4">
              <Form.Label className="text-muted">Account Type</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="form-select-lg border-2"
                style={{ borderColor: '#FBB040' }}
              >
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-3 fw-bold border-0"
              style={{ 
                backgroundColor: '#FF5A4E',
                transition: 'all 0.3s ease',
              }}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center mt-4 mb-0">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-decoration-none fw-bold"
                style={{ color: '#FF5A4E' }}
              >
                Sign in here
              </Link>
            </p>
          </Form>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default Signup;