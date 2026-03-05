const express = require('express');
const router = express.Router();

const scanRoutes = require('./scan');
const historyRoutes = require('./history');
const threatsRoutes = require('./threats');
const reportRoutes = require('./reportRoutes');

// Mount routes
router.use('/scan', scanRoutes);
router.use('/history', historyRoutes);
router.use('/threats', threatsRoutes);
router.use('/report', reportRoutes);


// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
