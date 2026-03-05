const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET /api/history - ดึงประวัติทั้งหมด
router.get('/', historyController.getHistory.bind(historyController));

// GET /api/history/dangerous - ดึงประวัติที่เป็นอันตราย
router.get('/dangerous', historyController.getDangerousHistory.bind(historyController));

// GET /api/history/safe - ดึงประวัติที่ปลอดภัย
router.get('/safe', historyController.getSafeHistory.bind(historyController));

// GET /api/history/stats - สถิติ
router.get('/stats', historyController.getStats.bind(historyController));

// DELETE /api/history - ลบประวัติทั้งหมด
router.delete('/', historyController.clearHistory.bind(historyController));

module.exports = router;
