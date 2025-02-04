import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Alert, Container, Spinner, Card } from 'react-bootstrap';
import '../styles/styles.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setMessage('✅ Email verified successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setError(err.response?.data?.message || '⚠️ Verification failed');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '450px' }}>
        <h2 className="fw-bold mb-3" style={{ color: '#FF5A4E' }}>Email Verification</h2>
        {loading ? (
          <Spinner animation="border" variant="warning" className="my-3" />
        ) : (
          <>
            {message && <Alert variant="success" className="fw-bold">{message}</Alert>}
            {error && <Alert variant="danger" className="fw-bold">{error}</Alert>}
          </>
        )}
      </Card>
    </Container>
  );
};

export default VerifyEmail;