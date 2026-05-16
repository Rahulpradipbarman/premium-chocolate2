import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../config';

const Admin = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Bars'
  });
  const [imageFile, setImageFile] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  }, [token]);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (token) {
      fetchProducts();
      fetchOrders();
    }
  }, [user, token, navigate, fetchProducts, fetchOrders]);

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Error updating status', err);
      alert('Error updating status');
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
        category: formData.category === 'custom' ? customCategory : (formData.category || 'Uncategorized'),
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
      stock: product.stock || 0,
      category: product.category || 'Bars'
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setExistingImageUrl(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: 'Bars' });
    setImageFile(null);
    setCustomCategory('');
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

  if (loading) return <div className="container" style={{paddingTop: '64px'}}>Loading...</div>;

  // Calculate unique categories from products, plus defaults
  const uniqueCategories = [...new Set([
    'Bars', 'Truffles', 'Gifts', 'Uncategorized', 
    ...products.map(p => p.category).filter(Boolean)
  ])];

  return (
    <div className="page" style={{ paddingTop: '64px' }}>
      <div className="container section-padding">
        <div className="page-header admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your products and orders.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="admin-products-grid">
          {/* Add/Edit Product Form */}
          <div className="admin-card">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" style={{ width: '100%', padding: '8px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '8px', background: '#F5F1E7', color: '#000', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' }}>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">+ Add New Category</option>
                </select>
                {formData.category === 'custom' && (
                  <input 
                    type="text" 
                    placeholder="Enter new category name..." 
                    value={customCategory} 
                    onChange={(e) => setCustomCategory(e.target.value)} 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', marginTop: '8px' }} 
                    required 
                  />
                )}
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Product Image {editingId && '(Leave empty to keep existing)'}</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className="form-control" style={{ width: '100%', padding: '8px', background: 'transparent' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                  {uploading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="admin-products">
            <h2>Current Products</h2>
            <div style={{ marginTop: '24px', overflowX: 'auto' }}>
              {products.length === 0 ? (
                <p>No products found. Add your first product!</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '12px' }}>Image</th>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Price</th>
                      <th style={{ padding: '12px' }}>Stock</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}>
                          <img src={product.image_url || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ padding: '12px' }}>{product.name}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '12px', background: 'var(--bg-body)', fontSize: '0.85rem' }}>{product.category || 'Uncategorized'}</span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--color-primary)' }}>₹{product.price}</td>
                        <td style={{ padding: '12px' }}>{product.stock}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(product)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', padding: '4px 8px' }}>Edit</button>
                            <button onClick={() => handleDelete(product.id)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '4px 8px' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        ) : (
          <div className="admin-orders">
            <h2>Incoming Orders</h2>
            <div style={{ marginTop: '24px', overflowX: 'auto' }}>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '12px' }}>Order ID</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Items</th>
                      <th style={{ padding: '12px' }}>Total</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'top' }}>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order.id.substring(0, 8)}</span>
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                          <div style={{ fontWeight: 'bold' }}>{order.users?.full_name}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{order.users?.email}</div>
                          <div style={{ color: 'var(--text-muted)', marginTop: '4px', maxWidth: '200px' }}>
                            {order.shipping_address?.address}
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {order.order_items.map((item, idx) => (
                              <li key={idx}>{item.quantity}x {item.products?.name || 'Unknown'}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ padding: '16px 12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                          ₹{order.total_amount}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '4px', background: '#F5F1E7', color: '#000', border: '1px solid #ccc', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
