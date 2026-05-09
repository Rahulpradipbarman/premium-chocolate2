import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isLoggedIn, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to place an order.");
      return;
    }
    
    setIsProcessing(true);

    // MOCK PAYMENT PROCESS (Since we don't have a real Razorpay/Stripe key yet)
    setTimeout(async () => {
      try {
        // Send order to backend
        const orderData = {
          cartItems,
          shippingAddress: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          }
        };

        await axios.post('http://localhost:5000/api/orders', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsProcessing(false);
        alert(`Payment successful! Order placed.`);
        clearCart();
        onClose();
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Payment succeeded but failed to save order. Please contact support.');
        setIsProcessing(false);
      }
    }, 1500); // Simulate a 1.5 second loading delay
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: 0 }}>Secure Checkout</h2>
          <button onClick={onClose} className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea name="address" className="form-input" rows="3" required value={formData.address} onChange={handleInputChange}></textarea>
          </div>
          
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Total: <span className="gold-text">₹{subtotal}</span></span>
            <button type="submit" className="btn btn-solid" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
