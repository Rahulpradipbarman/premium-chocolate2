import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="page" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="page" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: '120px' }}>
      <div className="container section-padding">
        <Link to="/shop" style={{ color: 'var(--text-muted)', display: 'inline-block', marginBottom: '30px' }}>
          &larr; Back to Shop
        </Link>
        
        <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>
          {/* Image Gallery */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/600'} 
              alt={product.name} 
              style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '30px' }}>₹{product.price}</p>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '40px' }}>
              {product.description}
            </p>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginBottom: '40px' }}
              onClick={() => addToCart(product)}
            >
              Add to Cart - ₹{product.price}
            </button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>Ingredients</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
                {product.ingredients || 'High-quality artisan cocoa, organic cane sugar, cocoa butter. (Ingredients not fully specified)'}
              </p>

              <h3 style={{ marginBottom: '15px' }}>Allergy Information</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {product.allergy_info || 'Manufactured in a facility that also processes milk, soy, peanuts, and other tree nuts.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
