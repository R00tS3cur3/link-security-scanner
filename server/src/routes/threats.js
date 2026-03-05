const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');

// GET /api/threats/top10 - Top 10 URL อันตราย
router.get('/top10', threatController.getTop10.bind(threatController));

// GET /api/threats - URL อันตรายทั้งหมด
router.get('/', threatController.getAll.bind(threatController));

// GET /api/threats/count - นับจำนวน
router.get('/count', threatController.getCount.bind(threatController));

module.exports = router;
