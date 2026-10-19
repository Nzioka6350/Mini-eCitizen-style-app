import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetUrl('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' }}>
          ← Back to login
        </Link>

        <div className="auth-header">
          <h1>Forgot password?</h1>
          <p>Enter your email and we'll generate a reset link.</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ color: 'var(--primary-green)', marginBottom: '1rem', fontSize: '0.9rem' }}>{message}</div>}

        {resetUrl && (
          <div style={{ backgroundColor: '#e8f3ec', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', wordBreak: 'break-all' }}>
            <strong>Reset link (testing only):</strong><br />
            <a href={resetUrl} style={{ color: 'var(--primary-green)' }}>{resetUrl}</a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;