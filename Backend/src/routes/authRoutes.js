import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// Health check for auth
router.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running' });
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ success: true, data: { user: data.user } });
  } catch (error) {
    console.error('[Auth Routes] Verify error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
