import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Admin = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = existingImageUrl; // Default to existing image if editing

      // 1. Upload Image (only if a new file is selected)
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await axios.post(`${API_URL}/products/upload`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      // 2. Save Product
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        image_url: imageUrl
      };

      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 3. Reset form and refresh list
      resetForm();
      fetchProducts();
      alert(editingId ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (err) {
      console.error('Error saving product', err);
      alert('Error saving product');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setExistingImageUrl(product.image_url);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock || 0
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setExistingImageUrl(null);
    setFormData({ name: '', description: '', price: '', stock: '' });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '100px'}}>Loading...</div>;

  return (
    <div className="page" style={{ paddingTop: '100px' }}>
      <div className="container section-padding">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your products and store inventory.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          {/* Add/Edit Product Form */}
          <div className="admin-card" style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: '12px' }}>
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '10px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" style={{ width: '100%', padding: '10px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '10px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Product Image {editingId && '(Leave empty to keep existing)'}</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className="form-control" style={{ width: '100%', padding: '10px', background: 'transparent' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                  {uploading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ padding: '10px 20px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="admin-products" style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: '12px' }}>
            <h2>Current Products</h2>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {products.length === 0 ? (
                <p>No products found. Add your first product!</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--bg-body)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={product.image_url || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <h4 style={{ margin: '0' }}>{product.name}</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-primary)' }}>₹{product.price}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(product)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)' }}>Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
