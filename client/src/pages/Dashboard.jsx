import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/orders/me`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError('Failed to load profile. Please try logging in again.');
        if (err.response?.status === 401) {
          logout();
        }
      }
    };

    if (token) {
      fetchProfileAndOrders();
    }
  }, [token, logout]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: '0 var(--space-3) var(--space-8)' }}>
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

      {profile && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Your Order History</h2>
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {orders.map(order => (
                <div key={order.id} style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>Order ID: {order.id.substring(0, 8)}...</strong>
                    <span style={{ color: 'var(--color-primary)' }}>{order.status}</span>
                  </div>
                  <p style={{ margin: '5px 0' }}>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total: ₹{order.total_amount}</p>
                  <div style={{ marginTop: '15px' }}>
                    {order.order_items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', fontSize: '0.9rem' }}>
                        <img src={item.products.image_url || 'https://via.placeholder.com/50'} alt={item.products.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span>{item.quantity}x {item.products.name}</span>
                        <span style={{ marginLeft: 'auto' }}>₹{item.price_at_purchase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
