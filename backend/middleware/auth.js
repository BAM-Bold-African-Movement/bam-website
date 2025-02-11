const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    logger.debug('Processing authentication token');

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug('Token verified successfully', { userId: decoded.id });

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Authentication error', { 
      error: err.message,
      stack: err.stack
    });
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 