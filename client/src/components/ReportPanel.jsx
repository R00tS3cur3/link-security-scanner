import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const TABS = [
    { key: 'daily', type: 'day', label: '📅 รายวัน' },
    { key: 'monthly', type: 'month', label: '📆 รายเดือน' },
    { key: 'yearly', type: 'year', label: '🗓️ รายปี' },
];

function formatPeriod(period, tab) {
    if (tab === 'daily') {
        const d = new Date(period + 'T00:00:00+07:00');
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (tab === 'monthly') {
        const [year, month] = period.split('-');
        const d = new Date(year, month - 1);
        return d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
    }
    return `ปี ${period}`;
}

function downloadCSV(type, period) {
    const url = `${API_BASE}/report/export?type=${type}&period=${encodeURIComponent(period)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${type}_${period}.csv`;
    a.click();
}

export default function ReportPanel() {
    const [activeTab, setActiveTab] = useState('daily');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReport(activeTab);
    }, [activeTab]);

    const fetchReport = async (tab) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/report/${tab}`);
            const json = await res.json();
            setData(json.success ? json.data : []);
        } catch (e) {
            setError('ไม่สามารถโหลดรายงานได้');
        } finally {
            setLoading(false);
        }
    };

    const currentTab = TABS.find(t => t.key === activeTab);

    return (
        <div style={{
            background: '#0d1117',
            border: '1px solid #00ff8844',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            fontFamily: 'monospace'
        }}>
            <h3 style={{ color: '#00ff88', marginBottom: '16px', fontSize: '18px' }}>
                📊 รายงานการสแกน
            </h3>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            background: activeTab === tab.key ? '#00ff88' : '#1a2035',
                            color: activeTab === tab.key ? '#0d1117' : '#00ff88',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && (
                <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>กำลังโหลด...</div>
            )}
            {error && (
                <div style={{ color: '#ff0055', padding: '10px' }}>{error}</div>
            )}
            {!loading && !error && data.length === 0 && (
                <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                    ยังไม่มีข้อมูล — ลองสแกน URL ก่อนครับ
                </div>
            )}

            {!loading && !error && data.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #00ff8844' }}>
                            <th style={{ textAlign: 'left', padding: '8px', color: '#00ff88' }}>
                                {activeTab === 'daily' ? 'วันที่' : activeTab === 'monthly' ? 'เดือน' : 'ปี'}
                            </th>
                            <th style={{ textAlign: 'center', padding: '8px', color: '#00ff88' }}>สแกนทั้งหมด</th>
                            <th style={{ textAlign: 'center', padding: '8px', color: '#ff0055' }}>🔴 อันตราย</th>
                            <th style={{ textAlign: 'center', padding: '8px', color: '#00ff88' }}>🟢 ปลอดภัย</th>
                            <th style={{ textAlign: 'center', padding: '8px', color: '#888' }}>Export</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                style={{
                                    borderBottom: '1px solid #ffffff11',
                                    background: i % 2 === 0 ? 'transparent' : '#ffffff05'
                                }}
                            >
                                <td style={{ padding: '10px 8px', color: '#ccc' }}>
                                    {formatPeriod(row.period, activeTab)}
                                </td>
                                <td style={{ textAlign: 'center', padding: '10px 8px', color: '#fff', fontWeight: 'bold' }}>
                                    {row.total}
                                </td>
                                <td style={{ textAlign: 'center', padding: '10px 8px', color: '#ff0055' }}>
                                    {row.dangerous}
                                </td>
                                <td style={{ textAlign: 'center', padding: '10px 8px', color: '#00ff88' }}>
                                    {row.safe}
                                </td>
                                <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                                    <button
                                        onClick={() => downloadCSV(currentTab.type, row.period)}
                                        title="ดาวน์โหลด CSV"
                                        style={{
                                            padding: '4px 10px',
                                            background: '#1a2035',
                                            color: '#00ff88',
                                            border: '1px solid #00ff8844',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        ⬇️ CSV
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
