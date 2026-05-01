import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Selection</h2>
          <button className="cart-close icon-btn" onClick={() => setIsCartOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
              <Link to="/shop" onClick={() => setIsCartOpen(false)} className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-subtotal-val">₹{subtotal}</span>
            </div>
            <button 
              className="btn btn-solid" 
              style={{ width: '100%' }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

export default CartDrawer;
