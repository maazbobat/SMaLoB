import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Customer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/auth/signup', formData);
      alert('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      alert('Error during signup. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4" style={{ color: '#FF5A4E' }}>Create an Account</h2>
          <Form onSubmit={handleSubmit} style={{ backgroundColor: '#FBB040', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label style={{ color: '#333', fontWeight: 'bold' }}>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </Form.Group>

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
              Sign Up
            </Button>
          </Form>
          <p className="text-center mt-3">
            Already have an account? <a href="/login" style={{ color: '#FF5A4E', fontWeight: 'bold' }}>Login here</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
