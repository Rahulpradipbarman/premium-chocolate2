const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');
const { sendWelcomeEmail } = require('../lib/email');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeythatyoushouldchange';

router.post('/signup', async (req, res) => {
  const { fullName, email, password, subscribeToNewsletter } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save new user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([
        { full_name: fullName, email, password_hash: passwordHash, is_subscribed: subscribeToNewsletter }
      ])
      .select('id')
      .single();

    if (userError) throw userError;

    // Save to newsletter if subscribed
    if (subscribeToNewsletter) {
      const { error: subError } = await supabase
        .from('email_subscribers')
        .insert([{ email }]);
      if (subError) console.error('Error saving subscriber:', subError);
    }

    // Send welcome email
    await sendWelcomeEmail(email, fullName.split(' ')[0]);

    res.status(201).json({ message: 'Account created', userId: newUser.id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Look up user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, cart: user.cart || [] }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
