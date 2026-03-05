const ScanHistory = require('../models/ScanHistory');
const ipHelper = require('../utils/ipHelper');

class HistoryController {
  // ดึงประวัติทั้งหมด
  async getHistory(req, res, next) {
    try {
      const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
      const limit = parseInt(req.query.limit) || 50;

      const history = await ScanHistory.getByUserIP(userIP, limit);

      res.json({
        success: true,
        data: {
          total: history.length,
          items: history
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ดึงประวัติที่เป็นอันตราย
  async getDangerousHistory(req, res, next) {
    try {
      const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
      const limit = parseInt(req.query.limit) || 50;

      const history = await ScanHistory.getDangerousByUserIP(userIP, limit);

      res.json({
        success: true,
        data: {
          total: history.length,
          items: history
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ดึงประวัติที่ปลอดภัย
  async getSafeHistory(req, res, next) {
    try {
      const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
      const limit = parseInt(req.query.limit) || 50;

      const history = await ScanHistory.getSafeByUserIP(userIP, limit);

      res.json({
        success: true,
        data: {
          total: history.length,
          items: history
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ลบประวัติทั้งหมด
  async clearHistory(req, res, next) {
    try {
      const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));

      const deletedCount = await ScanHistory.deleteByUserIP(userIP);

      res.json({
        success: true,
        data: {
          message: 'History cleared successfully',
          deletedCount: deletedCount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // นับจำนวนการสแกน
  async getStats(req, res, next) {
    try {
      const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));

      const totalScans = await ScanHistory.countByUserIP(userIP);

      res.json({
        success: true,
        data: {
          totalScans: totalScans
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HistoryController();
