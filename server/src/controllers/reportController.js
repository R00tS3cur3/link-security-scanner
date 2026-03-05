const ScanHistory = require('../models/ScanHistory');
const ipHelper = require('../utils/ipHelper');

// รายงานรายวัน
const getDaily = async (req, res, next) => {
    try {
        const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
        const data = await ScanHistory.getReportByDay(userIP);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// รายงานรายเดือน
const getMonthly = async (req, res, next) => {
    try {
        const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
        const data = await ScanHistory.getReportByMonth(userIP);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// รายงานรายปี
const getYearly = async (req, res, next) => {
    try {
        const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
        const data = await ScanHistory.getReportByYear(userIP);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// Export CSV รายละเอียด URL ของช่วงเวลาที่เลือก
const exportCSV = async (req, res, next) => {
    try {
        const userIP = ipHelper.normalizeIP(ipHelper.getUserIP(req));
        const { type, period } = req.query; // type=day|month|year, period=2026-02-18

        if (!type || !period) {
            return res.status(400).json({ success: false, error: 'type and period are required' });
        }

        const rows = await ScanHistory.getDetailsByPeriod(userIP, type, period);

        // สร้าง CSV
        const header = 'เวลา,URL,คะแนนความเสี่ยง (%),สถานะ,Malicious,Suspicious,Total Engines\n';
        const body = rows.map(r => {
            const status = r.is_dangerous ? 'อันตราย' : 'ปลอดภัย';
            const url = `"${(r.final_url || '').replace(/"/g, '""')}"`;
            return `${r.scan_time},${url},${r.security_score},${status},${r.malicious_count},${r.suspicious_count},${r.total_engines}`;
        }).join('\n');

        const csv = '\uFEFF' + header + body; // BOM สำหรับ Excel ภาษาไทย

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="report_${type}_${period}.csv"`);
        res.send(csv);
    } catch (error) {
        next(error);
    }
};

module.exports = { getDaily, getMonthly, getYearly, exportCSV };
