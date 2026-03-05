const db = require('../config/database');

class DangerousUrl {
  // เพิ่มหรืออัพเดท URL อันตราย
  async upsert(url, domain, securityScore) {
    // ตรวจสอบว่ามีอยู่แล้วหรือไม่
    const existing = await this.getByURL(url);

    if (existing) {
      // อัพเดท
      const newScanCount = existing.scanCount + 1;
      const newAvgScore = ((existing.avgSecurityScore * existing.scanCount) + securityScore) / newScanCount;
      const newMaxScore = Math.max(existing.maxSecurityScore, securityScore);

      const sql = `
        UPDATE dangerous_urls
        SET scan_count = ?,
            avg_security_score = ?,
            max_security_score = ?,
            last_updated = CURRENT_TIMESTAMP
        WHERE url = ?
      `;

      await db.run(sql, [newScanCount, newAvgScore, newMaxScore, url]);
      return existing.id;
    } else {
      // สร้างใหม่
      const sql = `
        INSERT INTO dangerous_urls (url, domain, avg_security_score, max_security_score)
        VALUES (?, ?, ?, ?)
      `;

      const result = await db.run(sql, [url, domain, securityScore, securityScore]);
      return result.id;
    }
  }

  // ดึงข้อมูลจาก URL
  async getByURL(url) {
    const sql = `SELECT * FROM dangerous_urls WHERE url = ?`;
    const row = await db.get(sql, [url]);
    return row ? this.formatRow(row) : null;
  }

  // ดึง Top 10 URL อันตราย
  async getTop10() {
    const sql = `
      SELECT * FROM dangerous_urls
      ORDER BY scan_count DESC, max_security_score DESC
      LIMIT 10
    `;

    const rows = await db.all(sql);
    return rows.map(row => this.formatRow(row));
  }

  // ดึง URL อันตรายทั้งหมด
  async getAll(limit = 100) {
    const sql = `
      SELECT * FROM dangerous_urls
      ORDER BY last_updated DESC
      LIMIT ?
    `;

    const rows = await db.all(sql, [limit]);
    return rows.map(row => this.formatRow(row));
  }

  // ลบ URL
  async delete(url) {
    const sql = `DELETE FROM dangerous_urls WHERE url = ?`;
    const result = await db.run(sql, [url]);
    return result.changes;
  }

  // นับจำนวน URL อันตรายทั้งหมด
  async count() {
    const sql = `SELECT COUNT(*) as count FROM dangerous_urls`;
    const row = await db.get(sql);
    return row.count;
  }

  // ลบ URL ที่ไม่ถูกรายงานมานาน
  async deleteOldRecords(days = 90) {
    const sql = `
      DELETE FROM dangerous_urls
      WHERE last_updated < datetime('now', '-${days} days')
      AND scan_count = 1
    `;
    const result = await db.run(sql);
    return result.changes;
  }

  // Format row
  formatRow(row) {
    return {
      id: row.id,
      url: row.url,
      domain: row.domain,
      firstDetected: row.first_detected,
      scanCount: row.scan_count,
      avgSecurityScore: parseFloat(row.avg_security_score || 0).toFixed(1),
      maxSecurityScore: row.max_security_score,
      lastUpdated: row.last_updated
    };
  }
}

module.exports = new DangerousUrl();
