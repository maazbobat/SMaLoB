import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Navbar, Nav, FloatingLabel, Alert } from 'react-bootstrap';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import '../styles/styles.css';
import logo from '../assets/logo/logo_transparent.png';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmail] = useState('');
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

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });

    console.log("✅ Login Response:", response.data);

    const { token, role, name } = response.data;

    if (!token) {
      console.error("❌ No token received! API might be failing.");
      setError("Login failed. No token received.");
      return;
    }

    // ✅ Store token and role in LocalStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    login(token, role, name); // Ensure `login` function updates the context

    // ✅ Correcting Route Redirection Paths
    const dashboardPaths = {
      Admin: "/admin/dashboard",
      Vendor: "/vendor/dashboard",
      Customer: "/customer/dashboard",
    };

    navigate(dashboardPaths[role] || "/");

  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    setError(error.response?.data?.message || "Login failed");
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
            <img src={logo} alt="SMaLoB Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
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
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#FF5A4E' }}>Welcome Back</h2>
            <p className="text-muted">Sign in to your SMaLoB account</p>
          </div>

          <Form onSubmit={handleLoginSubmit} className="bg-white p-4 rounded-4 shadow">
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

            <FloatingLabel controlId="email" label="Email Address" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-2 py-3"
                style={{ borderColor: '#FBB040' }}
              />
              <FiMail className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
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
                style={{ borderColor: '#FBB040' }}
              />
              <FiLock className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ color: '#FBB040' }} />
            </FloatingLabel>

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
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <FiLogIn className="me-2" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <Link 
                to="/forgot-password" 
                className="text-decoration-none small fw-bold"
                style={{ color: '#FF5A4E' }}
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-center mt-4 mb-0">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-decoration-none fw-bold"
                style={{ color: '#FF5A4E' }}
              >
                Create Account
              </Link>
            </p>
          </Form>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default Login;