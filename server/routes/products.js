const express = require('express');
const supabase = require('../lib/supabase');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST new product (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url, stock }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// PUT update product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;

  try {
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({ name, description, price, image_url, stock })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
