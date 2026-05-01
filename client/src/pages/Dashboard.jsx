import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/me');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile. Please try logging in again.');
        if (err.response?.status === 401) {
          logout();
        }
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, logout]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-3)' }}>
      <h1 style={{ marginBottom: 'var(--space-4)' }}>Welcome to your Dashboard, {user?.fullName?.split(' ')[0]}!</h1>
      
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : profile ? (
        <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Account Details</h2>
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          <p><strong>Newsletter:</strong> {profile.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</p>
          
          <button onClick={handleLogout} className="btn btn-secondary" style={{ marginTop: 'var(--space-6)' }}>
            Log Out
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
