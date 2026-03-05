const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { scanLimiter } = require('../middleware/rateLimiter');

// POST /api/scan - สแกน URL
router.post('/', scanLimiter, scanController.scanURL.bind(scanController));

module.exports = router;
