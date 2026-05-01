const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const supabase = require('../lib/supabase');

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name, email, created_at, is_subscribed, cart')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      createdAt: user.created_at,
      isSubscribed: user.is_subscribed,
      cart: user.cart || []
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/cart', verifyToken, async (req, res) => {
  const { cart } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ cart })
      .eq('id', req.user.id)
      .select('cart')
      .single();

    if (error) throw error;
    res.json({ cart: data.cart || [] });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
