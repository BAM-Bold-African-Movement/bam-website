const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userIP: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || 'anonymous'
    });
  });

  next();
};

module.exports = requestLogger; 