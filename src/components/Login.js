import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Customer' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      alert('Login successful!');

      // Redirect based on role
      switch (res.data.role) {
        case 'Customer':
          navigate('/customer-dashboard');
          break;
        case 'Vendor':
          navigate('/vendor-dashboard');
          break;
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid login credentials. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4" style={{ color: '#FF5A4E' }}>Login to Your Account</h2>
          <Form onSubmit={handleSubmit} style={{ backgroundColor: '#FBB040', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label style={{ color: '#333', fontWeight: 'bold' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label style={{ color: '#333', fontWeight: 'bold' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label style={{ color: '#333', fontWeight: 'bold' }}>Role</Form.Label>
              <Form.Select name="role" onChange={handleChange} style={{ color: '#333', fontWeight: 'bold' }}>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <p className="text-center mt-3">
            Don't have an account? <a href="/signup" style={{ color: '#FF5A4E', fontWeight: 'bold' }}>Sign up here</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
