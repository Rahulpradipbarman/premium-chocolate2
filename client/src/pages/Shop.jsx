import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Shop = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page" style={{ paddingTop: '100px' }}>
      <div className="container section-padding">
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>The Collection</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            Discover our meticulously crafted artisanal chocolates, designed for the refined palate.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search chocolates..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ width: '100%', maxWidth: '400px', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    border: `1px solid ${activeCategory === cat ? 'var(--color-primary)' : 'var(--border-color)'}`, 
                    background: activeCategory === cat ? 'var(--color-primary)' : 'transparent', 
                    color: activeCategory === cat ? '#000' : 'var(--text-main)', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-grid">
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading collections...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products available at the moment.</p>
          ) : (
            products.map(product => (
              <div 
                key={product.id} 
                className="product-card" 
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-wrap">
                  <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" loading="lazy" />
                  <div className="product-overlay"></div>
                  <div className="product-add">
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description || product.desc}</p>
                  <p className="product-price">₹{product.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
