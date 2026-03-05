const express = require('express');
const router = express.Router();
const { getDaily, getMonthly, getYearly, exportCSV } = require('../controllers/reportController');

router.get('/daily', getDaily);
router.get('/monthly', getMonthly);
router.get('/yearly', getYearly);
router.get('/export', exportCSV);

module.exports = router;
