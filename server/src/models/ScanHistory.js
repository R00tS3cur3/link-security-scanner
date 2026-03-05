const db = require('../config/database');

class ScanHistory {
  // บันทึกประวัติการสแกน
  async create(data) {
    const sql = `
      INSERT INTO scan_history (
        user_ip, original_input, scanned_url, was_shortened, final_url,
        security_score, is_dangerous, threat_details, country, ip_address,
        virustotal_data, malicious_count, suspicious_count, total_engines
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.userIP,
      data.originalInput,
      data.scannedURL,
      data.wasShortened ? 1 : 0,
      data.finalURL,
      data.securityScore,
      data.isDangerous ? 1 : 0,
      data.threatDetails,
      data.country,
      data.ipAddress,
      JSON.stringify(data.virusTotalData),
      data.maliciousCount || 0,
      data.suspiciousCount || 0,
      data.totalEngines || 0
    ];

    const result = await db.run(sql, params);
    return result.id;
  }

  // ดึงประวัติของ user IP
  async getByUserIP(userIP, limit = 50) {
    const sql = `
      SELECT * FROM scan_history
      WHERE user_ip = ?
      ORDER BY scan_timestamp DESC
      LIMIT ?
    `;

    const rows = await db.all(sql, [userIP, limit]);
    return rows.map(row => this.formatRow(row));
  }

  // ดึงประวัติที่เป็นอันตราย
  async getDangerousByUserIP(userIP, limit = 50) {
    const sql = `
      SELECT * FROM scan_history
      WHERE user_ip = ? AND is_dangerous = 1
      ORDER BY scan_timestamp DESC
      LIMIT ?
    `;

    const rows = await db.all(sql, [userIP, limit]);
    return rows.map(row => this.formatRow(row));
  }

  // ดึงประวัติที่ปลอดภัย
  async getSafeByUserIP(userIP, limit = 50) {
    const sql = `
      SELECT * FROM scan_history
      WHERE user_ip = ? AND is_dangerous = 0
      ORDER BY scan_timestamp DESC
      LIMIT ?
    `;

    const rows = await db.all(sql, [userIP, limit]);
    return rows.map(row => this.formatRow(row));
  }

  // ลบประวัติทั้งหมดของ user IP
  async deleteByUserIP(userIP) {
    const sql = `DELETE FROM scan_history WHERE user_ip = ?`;
    const result = await db.run(sql, [userIP]);
    return result.changes;
  }

  // ลบประวัติเก่า (เก็บแค่ 30 วัน)
  async deleteOldRecords(days = 30) {
    const sql = `
      DELETE FROM scan_history
      WHERE scan_timestamp < datetime('now', '-${days} days')
    `;
    const result = await db.run(sql);
    return result.changes;
  }

  // รายงานรายวัน
  async getReportByDay(userIP) {
    const sql = `
      SELECT
        DATE(scan_timestamp, '+7 hours') as period,
        COUNT(*) as total,
        SUM(CASE WHEN is_dangerous = 1 THEN 1 ELSE 0 END) as dangerous,
        SUM(CASE WHEN is_dangerous = 0 THEN 1 ELSE 0 END) as safe,
        ROUND(AVG(security_score), 1) as avgScore
      FROM scan_history
      WHERE user_ip = ?
      GROUP BY DATE(scan_timestamp, '+7 hours')
      ORDER BY period DESC
      LIMIT 90
    `;
    return await db.all(sql, [userIP]);
  }

  // รายงานรายเดือน
  async getReportByMonth(userIP) {
    const sql = `
      SELECT
        strftime('%Y-%m', scan_timestamp, '+7 hours') as period,
        COUNT(*) as total,
        SUM(CASE WHEN is_dangerous = 1 THEN 1 ELSE 0 END) as dangerous,
        SUM(CASE WHEN is_dangerous = 0 THEN 1 ELSE 0 END) as safe,
        ROUND(AVG(security_score), 1) as avgScore
      FROM scan_history
      WHERE user_ip = ?
      GROUP BY strftime('%Y-%m', scan_timestamp, '+7 hours')
      ORDER BY period DESC
      LIMIT 24
    `;
    return await db.all(sql, [userIP]);
  }

  // รายงานรายปี
  async getReportByYear(userIP) {
    const sql = `
      SELECT
        strftime('%Y', scan_timestamp, '+7 hours') as period,
        COUNT(*) as total,
        SUM(CASE WHEN is_dangerous = 1 THEN 1 ELSE 0 END) as dangerous,
        SUM(CASE WHEN is_dangerous = 0 THEN 1 ELSE 0 END) as safe,
        ROUND(AVG(security_score), 1) as avgScore
      FROM scan_history
      WHERE user_ip = ?
      GROUP BY strftime('%Y', scan_timestamp, '+7 hours')
      ORDER BY period DESC
    `;
    return await db.all(sql, [userIP]);
  }

  // ดึง URL รายละเอียดของช่วงเวลาที่เลือก (สำหรับ export)
  async getDetailsByPeriod(userIP, type, period) {
    // type = 'day' | 'month' | 'year'
    let dateExpr;
    if (type === 'day') dateExpr = `DATE(scan_timestamp, '+7 hours') = ?`;
    if (type === 'month') dateExpr = `strftime('%Y-%m', scan_timestamp, '+7 hours') = ?`;
    if (type === 'year') dateExpr = `strftime('%Y', scan_timestamp, '+7 hours') = ?`;

    const sql = `
      SELECT
        datetime(scan_timestamp, '+7 hours') as scan_time,
        final_url,
        security_score,
        is_dangerous,
        malicious_count,
        suspicious_count,
        total_engines
      FROM scan_history
      WHERE user_ip = ? AND ${dateExpr}
      ORDER BY scan_timestamp DESC
    `;
    return await db.all(sql, [userIP, period]);
  }

  // นับจำนวนการสแกนของ user IP


  async countByUserIP(userIP) {
    const sql = `SELECT COUNT(*) as count FROM scan_history WHERE user_ip = ?`;
    const row = await db.get(sql, [userIP]);
    return row.count;
  }

  // Format row
  formatRow(row) {
    return {
      id: row.id,
      userIP: row.user_ip,
      originalInput: row.original_input,
      scannedURL: row.scanned_url,
      wasShortened: row.was_shortened === 1,
      finalURL: row.final_url,
      securityScore: row.security_score,
      isDangerous: row.is_dangerous === 1,
      threatDetails: row.threat_details,
      country: row.country,
      ipAddress: row.ip_address,
      scanTimestamp: row.scan_timestamp,
      maliciousCount: row.malicious_count,
      suspiciousCount: row.suspicious_count,
      totalEngines: row.total_engines,
      virusTotalData: row.virustotal_data ? JSON.parse(row.virustotal_data) : null
    };
  }
}

module.exports = new ScanHistory();
