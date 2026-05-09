const express = require('express');
const supabase = require('../lib/supabase');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// POST create a new order (Authenticated users)
router.post('/', verifyToken, async (req, res) => {
  const { cartItems, shippingAddress } = req.body;
  const userId = req.user.id;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  try {
    // 1. Calculate total securely from DB and verify stock
    let totalAmount = 0;
    const itemsToInsert = [];
    const productsToUpdate = [];

    for (const item of cartItems) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, price, stock')
        .eq('id', item.id)
        .single();

      if (productError || !product) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }

      totalAmount += product.price * item.quantity;
      itemsToInsert.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price
      });

      productsToUpdate.push({
        id: product.id,
        newStock: product.stock - item.quantity
      });
    }

    // 2. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        status: 'Pending'
      }])
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 3. Create order items
    const orderItemsData = itemsToInsert.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 4. Reduce stock counts
    for (const prod of productsToUpdate) {
      await supabase
        .from('products')
        .update({ stock: prod.newStock })
        .eq('id', prod.id);
    }

    // Optional: Clear user's saved cart in the users table
    await supabase
      .from('users')
      .update({ cart: [] })
      .eq('id', userId);

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// GET user's own orders
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_purchase,
          products (name, image_url)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET all orders (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (full_name, email),
        order_items (
          quantity,
          price_at_purchase,
          products (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// PUT update order status (Admin only)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Status is required' });

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
