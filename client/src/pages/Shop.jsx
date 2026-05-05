import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const Shop = () => {
  const { addToCart } = useCart();
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
        <div className="page-header">
          <h1>The Collection</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Discover our meticulously crafted artisanal chocolates, designed for the refined palate.
          </p>
        </div>

        <div className="product-grid">
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading collections...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products available at the moment.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
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
                <p className="product-desc">{product.description}</p>
                <p className="product-price">₹{product.price}</p>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
