import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0604', padding: 'var(--space-8) var(--space-3) var(--space-4)', color: '#f5ecd7', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: '2rem' }}>Noir Luxe</h2>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.8 }}>
              Purveyors of fine artisan dark chocolate. Ethically sourced, masterfully crafted.
            </p>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><Link to="/shop" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Shop Collection</Link></li>
              <li><Link to="/our-story" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Our Story</Link></li>
              <li><Link to="/articles" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Journal & Recipes</Link></li>
              <li><Link to="/signup" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Join the Society</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Assistance</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><a href="#" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Shipping & Returns</a></li>
              <li><a href="#" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>FAQ</a></li>
              <li><a href="#" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Corporate Gifting</a></li>
              <li><Link to="/contact" style={{ color: '#f5ecd7', opacity: 0.8, textDecoration: 'none' }}>Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Connect</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}>contact@noirluxe.com</p>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>1-800-NOIR-LUX</p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <a href="#" style={{ color: '#d4af37' }} aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ color: '#d4af37' }} aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(245, 236, 215, 0.1)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', margin: 0 }}>© {new Date().getFullYear()} Noir Luxe. Artisan Dark Chocolate. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <a href="#" style={{ opacity: 0.6, fontSize: '0.8rem', color: '#f5ecd7', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ opacity: 0.6, fontSize: '0.8rem', color: '#f5ecd7', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
