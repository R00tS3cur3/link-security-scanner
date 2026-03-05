const rateLimit = require('express-rate-limit');

// Rate limiter สำหรับ scan endpoint
const scanLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 นาที
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10, // 10 requests ต่อนาที
  message: {
    success: false,
    error: {
      message: 'Too many scan requests. Please try again later.',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    // ใช้ IP เป็น key
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }
});

// Rate limiter ทั่วไป
const generalLimiter = rateLimit({
  windowMs: 60000, // 1 นาที
  max: 100, // 100 requests ต่อนาที
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please try again later.',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  scanLimiter,
  generalLimiter
};
