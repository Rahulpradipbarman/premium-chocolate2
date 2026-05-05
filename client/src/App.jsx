import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Articles from './pages/Articles';
import CartDrawer from './components/CartDrawer';
import './index.css';

const Navigation = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header>
      <div className="container nav">
        <div className="nav-left">
          <Link to="/" style={{ 
            fontSize: '1.4rem', 
            fontWeight: '600', 
            color: 'var(--color-primary)', 
            letterSpacing: '0.2em',
            fontFamily: 'var(--font-heading)' 
          }}>
            NOIR LUXE
          </Link>
        </div>
        
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/articles">Articles</Link>
        </div>

        <div className="nav-right">
          <ThemeToggle />
          
          <button className="icon-btn" style={{ position: 'relative', margin: '0 10px' }} onClick={() => setIsCartOpen(true)} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {isLoggedIn ? (
            <>
              {user?.role === 'admin' && <Link to="/admin" style={{ color: 'var(--color-primary)' }}>Admin</Link>}
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout} className="btn btn-secondary btn-sm" style={{ padding: '4px 12px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navigation />
          <CartDrawer />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
