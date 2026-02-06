const express = require('express');
const axios = require('axios');

const router = express.Router();

// Login with Puri token
router.post('/puri-login', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify token with Puri Auth service
    const puriAuthAPI = req.app.locals.puriAuthAPI;
    const serviceSecret = req.app.locals.serviceSecret;

    try {
      const verifyResponse = await axios.post(
        `${puriAuthAPI}/api/auth/verify-token`,
        { token },
        {
          headers: {
            'x-service-secret': serviceSecret
          }
        }
      );

      if (verifyResponse.data.valid && verifyResponse.data.user) {
        const user = verifyResponse.data.user;

        // Only allow verified @puri.com users
        if (!user.verified || !user.email.endsWith('@puri.com')) {
          return res.status(403).json({ error: 'User not verified or invalid email domain' });
        }

        // Create website session (in production, use proper session management)
        // For now, return user info with success
        res.json({
          success: true,
          message: 'Login successful',
          user: {
            email: user.email,
            verified: user.verified
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (verifyError) {
      console.error('Puri Auth verification error:', {
        message: verifyError.message,
        response: verifyError.response?.data,
        status: verifyError.response?.status,
        code: verifyError.code
      });
      
      // More specific error messages
      if (verifyError.code === 'ECONNREFUSED' || verifyError.code === 'ENOTFOUND') {
        return res.status(503).json({ 
          error: 'Puri Auth service is unavailable. Please try again later.' 
        });
      }
      
      if (verifyError.response?.status === 401) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      if (verifyError.response?.status === 403) {
        return res.status(403).json({ error: 'Service authentication failed' });
      }
      
      return res.status(401).json({ 
        error: 'Failed to verify token with Puri Auth: ' + (verifyError.message || 'Unknown error')
      });
    }
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // In a real app, invalidate session/token here
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;

