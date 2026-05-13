import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  const navStyle = {
    padding: isScrolled ? '12px 0' : '24px 0',
    backgroundColor: isDarkMode 
      ? (isScrolled ? 'rgba(26, 17, 10, 0.85)' : 'transparent')
      : '#fffaf0', // Static opaque cream in light mode
    boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
  };

  return (
    <header style={navStyle}>
      <div className="container nav" style={{ position: 'relative' }}>
        <div className="nav-left">
          <Link to="/" style={{ 
            fontSize: '1.6rem', 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            letterSpacing: '0.25em',
            fontFamily: 'var(--font-heading)',
            transition: 'all 0.3s ease'
          }}>
            NOIR LUXE
          </Link>
          
          {/* Hamburger button and Cart for mobile */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="icon-btn" style={{ position: 'relative' }} onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button className="icon-btn hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={`nav-menu-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="nav-center">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Collections</Link>
            <Link to="/articles" className={location.pathname === '/articles' ? 'active' : ''}>Journal</Link>
          </nav>

          <div className="nav-right">
            
            <button className="icon-btn desktop-only" style={{ position: 'relative', margin: '0 12px' }} onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {isLoggedIn ? (
              <div className="auth-buttons">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="admin-link" style={{ 
                    color: 'var(--color-primary)', 
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>ADMIN</Link>
                )}
                <Link to="/dashboard" style={{ fontSize: '0.8rem' }}>Account</Link>
                <button onClick={logout} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" style={{ fontSize: '0.8rem' }}>Login</Link>
                <Link to="/signup" className="btn btn-sm" style={{ padding: '8px 20px' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
