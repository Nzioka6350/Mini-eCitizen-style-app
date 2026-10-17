import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create citizen account</h1>
          <p>Register once to access all county services.</p>
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: 'var(--primary-green)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone (M-Pesa)</label>
            <input type="text" name="phone" className="form-control" placeholder="0712345678" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;