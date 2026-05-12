import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ExpandableDescription = ({ text, maxLength = 80 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = text || '';
  const shouldCollapse = description.length > maxLength;

  return (
    <div style={{ marginBottom: '12px' }}>
      <p className="product-desc" style={{ 
        display: 'inline', 
        fontSize: '0.85rem', 
        lineHeight: '1.6',
        opacity: 0.8
      }}>
        {isExpanded ? description : `${description.slice(0, maxLength)}${shouldCollapse ? '...' : ''}`}
      </p>
      {shouldCollapse && (
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-primary)', 
            fontSize: '0.75rem', 
            fontWeight: '700',
            marginLeft: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
};

const Shop = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
              style={{ 
                width: '100%', 
                maxWidth: '500px', 
                padding: '16px 28px', 
                borderRadius: '40px', 
                border: '1px solid var(--color-border)', 
                background: 'var(--color-surface)', 
                color: 'var(--color-text)', 
                fontSize: '1rem', 
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
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
          ) : filteredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products available at the moment.</p>
          ) : (
            filteredProducts.map(product => (
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
                <div className="product-info" style={{ padding: '24px', textAlign: 'left' }}>
                  <h3 className="product-title" style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '8px' }}>{product.name}</h3>
                  <ExpandableDescription text={product.description || product.desc} />
                  <p className="product-price" style={{ fontSize: '1.1rem', marginTop: '12px' }}>₹{product.price}</p>
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
