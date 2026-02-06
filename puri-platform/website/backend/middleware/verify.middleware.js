const axios = require('axios');

const verifyPuriToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const puriAuthAPI = req.app.locals.puriAuthAPI;
    const serviceSecret = req.app.locals.serviceSecret;

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
      req.user = verifyResponse.data.user;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Failed to verify token' });
  }
};

module.exports = { verifyPuriToken };

