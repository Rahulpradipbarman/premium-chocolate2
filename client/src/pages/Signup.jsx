import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    subscribeToNewsletter: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login', { state: { message: 'Account created successfully. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>Create Account</h2>
        {error && <div style={{ color: 'red', marginBottom: 'var(--space-2)' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <input 
              type="checkbox" 
              id="subscribeToNewsletter" 
              name="subscribeToNewsletter" 
              checked={formData.subscribeToNewsletter} 
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            <label htmlFor="subscribeToNewsletter" style={{ margin: 0 }}>Subscribe to newsletter</label>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          Already have an account? <Link to="/login">Log in here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
