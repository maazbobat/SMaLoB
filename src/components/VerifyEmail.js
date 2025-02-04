// components/VerifyEmail.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Alert, Container } from 'react-bootstrap';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <Container className="text-center mt-5">
      <h2>Email Verification</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
};

export default VerifyEmail;