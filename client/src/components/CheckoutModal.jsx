import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { subtotal, clearCart } = useCart();
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

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const amountInPaise = subtotal * 100;

    const options = {
      key: "rzp_test_XXXXXXXXXX", // Placeholder key as requested
      amount: amountInPaise,
      currency: "INR",
      name: "Luxe Noir",
      description: "Artisan Dark Chocolate Purchase",
      handler: function (response) {
        setIsProcessing(false);
        // On success
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        clearCart();
        onClose();
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#C9A84C"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      setIsProcessing(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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
          
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
