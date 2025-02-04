import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FiLock, FiKey } from 'react-icons/fi';
import '../styles/styles.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 3000); // Redirect to login page
        } catch (err) {
            setError('Failed to reset password. Try again.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '450px' }}>
                <h2 className="fw-bold mb-3" style={{ color: '#FF5A4E' }}>Reset Password</h2>
                <p className="text-muted">Enter a new password for your account.</p>
                <Form onSubmit={handleSubmit}>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <div className="input-group">
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="border-2"
                                style={{ borderColor: '#FBB040' }}
                            />
                            <span className="input-group-text" style={{ backgroundColor: '#FBB040', color: 'white' }}>
                                <FiLock />
                            </span>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="input-group">
                            <Form.Control 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className="border-2"
                                style={{ borderColor: '#FBB040' }}
                            />
                            <span className="input-group-text" style={{ backgroundColor: '#FBB040', color: 'white' }}>
                                <FiKey />
                            </span>
                        </div>
                    </Form.Group>

                    <Button type="submit" className="w-100 py-2 fw-bold border-0" style={{ backgroundColor: '#FF5A4E' }}>
                        Reset Password
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ResetPassword;