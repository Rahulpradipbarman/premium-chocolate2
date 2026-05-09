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
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

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

    if (token) {
      fetchProducts();
      fetchOrders();
    }
  }, [user, token, navigate]);

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

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

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

  if (loading) return <div className="container" style={{paddingTop: '64px'}}>Loading...</div>;

  return (
    <div className="page" style={{ paddingTop: '64px' }}>
      <div className="container section-padding">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
          {/* Add/Edit Product Form */}
          <div className="admin-card" style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: '12px' }}>
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
          <div className="admin-products" style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: '12px' }}>
            <h2>Current Products</h2>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {products.length === 0 ? (
                <p>No products found. Add your first product!</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-body)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image_url || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <h4 style={{ margin: '0' }}>{product.name}</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-primary)' }}>₹{product.price}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(product)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)' }}>Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        ) : (
          <div className="admin-orders" style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: '12px' }}>
            <h2>Incoming Orders</h2>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{ padding: '24px', background: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0' }}>Order #{order.id.substring(0, 8)}</h3>
                        <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Placed by {order.users?.full_name} ({order.users?.email}) on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{order.total_amount}</span>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                        <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Items</h4>
                        {order.order_items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span>{item.quantity}x {item.products?.name || 'Unknown Product'}</span>
                            <span>₹{item.price_at_purchase}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Shipping Details</h4>
                        {order.shipping_address ? (
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            <p style={{ margin: 0 }}>{order.shipping_address.name}</p>
                            <p style={{ margin: 0 }}>{order.shipping_address.phone}</p>
                            <p style={{ margin: 0 }}>{order.shipping_address.address}</p>
                          </div>
                        ) : (
                          <p>No shipping info</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
