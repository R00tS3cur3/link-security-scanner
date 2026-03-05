const DangerousUrl = require('../models/DangerousUrl');

class ThreatController {
  // ดึง Top 10 URL อันตราย
  async getTop10(req, res, next) {
    try {
      const threats = await DangerousUrl.getTop10();

      res.json({
        success: true,
        data: {
          total: threats.length,
          items: threats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ดึง URL อันตรายทั้งหมด
  async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const threats = await DangerousUrl.getAll(limit);

      res.json({
        success: true,
        data: {
          total: threats.length,
          items: threats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // นับจำนวน URL อันตราย
  async getCount(req, res, next) {
    try {
      const count = await DangerousUrl.count();

      res.json({
        success: true,
        data: {
          count: count
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ThreatController();
