import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Navbar, Nav, FloatingLabel, Alert } from 'react-bootstrap';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import '../styles/styles.css';
import logo from '../assets/logo/logo_transparent.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionExpired = searchParams.get('session_expired');
    
    if (sessionExpired) {
      setError('Your session has expired. Please log in again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [location]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Login.js
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Needed if using cookies
      });
  
      console.log("✅ Login response:", response.data);
  
      const { token, role } = response.data;
      localStorage.setItem('token', token);
  
      // Redirect based on role
      navigate(role === 'Admin' ? '/admin-dashboard' : '/dashboard');
  
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  

  const handleResendVerification = async () => {
    try {
      await api.post('/auth/resend-verification', { email: verificationEmail });
      setError('Verification email resent! Check your inbox');
    } catch (error) {
      setError('Failed to resend verification email');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="navbar-custom shadow-sm" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="SMaLoB Logo" height="60" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" style={{ borderColor: '#FBB040' }} />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/home" className="mx-2">Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
              <Nav.Link as={Link} to="/services" className="mx-2">Services</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-auto py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold brand-red">Welcome Back</h2>
              <p className="text-muted">Sign in to your SMaLoB account</p>
            </div>

            <Form onSubmit={handleLoginSubmit} className="auth-form">
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                  {verificationEmail && (
                    <div className="mt-2">
                      <Button 
                        variant="link" 
                        onClick={handleResendVerification}
                        className="text-danger p-0"
                      >
                        Resend Verification Email
                      </Button>
                    </div>
                  )}
                </Alert>
              )}

              <FloatingLabel label="Email Address" className="mb-4">
              <Form.Control
  type="email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  placeholder="Enter email"
/>
                <FiMail className="input-icon" />
              </FloatingLabel>

              <FloatingLabel label="Password" className="mb-4">
              <Form.Control
  type="password"
  name="password"
  value={formData.password}
  onChange={handleInputChange}
  placeholder="Enter password"
/>
                <FiLock className="input-icon" />
              </FloatingLabel>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 auth-button"
                disabled={loading}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <FiLogIn className="me-2" />
                    Sign In
                  </>
                )}
                {error && verificationEmail && (
      <div className="mt-2">
        <Button variant="link" onClick={handleResendVerification}>
          Resend Verification Email
        </Button>
      </div>
    )}
              </Button>

              <div className="text-center mt-4">
                <Link 
                  to="/forgot-password" 
                  className="text-decoration-none small brand-link"
                >
                  Forgot Password?
                </Link>
              </div>

              <p className="text-center mt-4 mb-0 text-muted">
                New user?{' '}
                <Link 
                  to="/signup" 
                  className="text-decoration-none fw-bold brand-link"
                >
                  Create Account
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Login;