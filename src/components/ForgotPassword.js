import React, { useState } from 'react';
import api from '../api/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FiMail, FiSend } from 'react-icons/fi';
import '../styles/styles.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to send password reset email. Try again.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '450px' }}>
                <h2 className="fw-bold mb-3" style={{ color: '#FF5A4E' }}>Forgot Password</h2>
                <p className="text-muted">Enter your email to receive a password reset link.</p>
                <Form onSubmit={handleSubmit}>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <div className="input-group">
                            <Form.Control 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="border-2"
                                style={{ borderColor: '#FBB040' }}
                            />
                            <span className="input-group-text" style={{ backgroundColor: '#FBB040', color: 'white' }}>
                                <FiMail />
                            </span>
                        </div>
                    </Form.Group>
                    <Button type="submit" className="w-100 py-2 fw-bold border-0" style={{ backgroundColor: '#FF5A4E' }}>
                        <FiSend className="me-2" /> Send Reset Link
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ForgotPassword;