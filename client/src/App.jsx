import React, { useState } from 'react';
import ReportPanel from './components/ReportPanel';
import { API_BASE_URL } from './utils/constants';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [threats, setThreats] = useState([]);

  // Load history and threats on mount
  React.useEffect(() => {
    loadHistory();
    loadThreats();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        setHistory(data.data.items);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const loadThreats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/threats/top10`);
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        setThreats(data.data.items);
      }
    } catch (err) {
      console.error('Failed to load threats:', err);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert('กรุณาใส่ URL');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });


      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data); // data.data contains the actual result
        loadHistory(); // Refresh history
        loadThreats(); // Refresh threats
      } else {
        setError(data.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('ไม่สามารถเชื่อมต่อ server ได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('ยืนยันการลบประวัติทั้งหมด?')) return;
    try {
      await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      backgroundImage: `
        linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
      color: '#00ff88',
      padding: '20px',
      fontFamily: 'Courier New, monospace'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '30px',
          background: 'rgba(6, 8, 19, 0.8)',
          border: '2px solid #00ff88',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
        }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 10px 0',
            textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88',
            letterSpacing: '3px'
          }}>
            🔒 LINK SECURITY SCANNER
          </h1>
          <p style={{ margin: 0, color: '#00ff88', opacity: 0.7 }}>
            ตรวจสอบความปลอดภัยของ URL ก่อนเข้าใช้งาน
          </p>
        </div>

        {/* Scan Form */}
        <form onSubmit={handleScan} style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'rgba(6, 8, 19, 0.8)',
            padding: '30px',
            border: '2px solid #00ff88',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)'
          }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ใส่ URL ที่ต้องการสแกน (เช่น https://example.com)"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                background: '#060813',
                border: '2px solid #00ff88',
                color: '#00ff88',
                marginBottom: '15px',
                fontFamily: 'Courier New, monospace',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                background: loading ? '#333' : '#00ff88',
                color: '#0a0e27',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontFamily: 'Courier New, monospace',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ กำลังสแกน...' : '🔍 สแกนเลย!'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            padding: '20px',
            background: 'rgba(255, 0, 85, 0.1)',
            border: '2px solid #ff0055',
            marginBottom: '20px',
            color: '#ff0055'
          }}>
            <strong>❌ เกิดข้อผิดพลาด:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            padding: '30px',
            background: 'rgba(6, 8, 19, 0.9)',
            border: '2px solid #00ff88',
            marginBottom: '30px',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
          }}>
            <h2 style={{
              marginBottom: '20px',
              fontSize: '28px',
              textShadow: '0 0 10px #00ff88'
            }}>
              ✅ ผลการสแกน
            </h2>

            <div style={{ marginBottom: '20px', wordBreak: 'break-all' }}>
              <strong>URL:</strong> {result.url?.final || result.url?.original || 'N/A'}
            </div>

            {result.url?.wasShortened && (
              <div style={{ marginBottom: '15px', color: '#ffaa00' }}>
                ⚠️ ลิงก์ย่อ: {result.url.original}
              </div>
            )}

            <div style={{
              marginBottom: '20px',
              padding: '20px',
              background: '#0a0e27',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                คะแนนความเสี่ยง
              </div>
              <div style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: result.security?.threatLevel === 'safe' ? '#00ff88' :
                  result.security?.threatLevel === 'low' ? '#00aaff' :
                    result.security?.threatLevel === 'suspicious' ? '#ffaa00' :
                      result.security?.threatLevel === 'dangerous' ? '#ff6600' : '#ff0055',
                textShadow: `0 0 20px ${result.security?.threatLevel === 'safe' ? '#00ff88' :
                  result.security?.threatLevel === 'low' ? '#00aaff' :
                    result.security?.threatLevel === 'suspicious' ? '#ffaa00' :
                      result.security?.threatLevel === 'dangerous' ? '#ff6600' : '#ff0055'
                  }`
              }}>
                {result.security?.score || 0}%
              </div>
              <div style={{
                fontSize: '18px',
                marginTop: '10px',
                color: result.security?.threatLevel === 'safe' ? '#00ff88' :
                  result.security?.threatLevel === 'low' ? '#00aaff' :
                    result.security?.threatLevel === 'suspicious' ? '#ffaa00' :
                      result.security?.threatLevel === 'dangerous' ? '#ff6600' : '#ff0055'
              }}>
                {result.security?.threatLevel === 'safe' && '✅ ปลอดภัย'}
                {result.security?.threatLevel === 'suspicious' && '⚠️ น่าสงสัย - ระวังด้วย'}
                {result.security?.threatLevel === 'dangerous' && '❌ อันตราย - อย่าเข้าเด็ดขาด!'}
                {result.security?.threatLevel === 'very_dangerous' && '🚨 อันตรายมาก - ห้ามเข้าเด็ดขาด!'}
              </div>
            </div>





            {result.geolocation && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#0a0e27' }}>
                <strong>🌍 ข้อมูลภูมิศาสตร์:</strong>
                <div style={{ marginTop: '10px' }}>
                  {result.geolocation.flag} {result.geolocation.country} • IP: {result.geolocation.ip}
                  {result.geolocation.city && ` • ${result.geolocation.city}`}
                </div>
              </div>
            )}



          </div>
        )}

        {/* History and Threats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {/* History Panel */}
          <div style={{
            background: 'rgba(6, 8, 19, 0.8)',
            border: '2px solid #00ff88',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>📜 ประวัติการสแกน</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    padding: '5px 15px',
                    background: '#ff0055',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Courier New, monospace'
                  }}
                >
                  🗑️ ล้าง
                </button>
              )}
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                  ไม่มีประวัติการสแกน
                </div>
              ) : (
                history.slice(0, 10).map((item, i) => (
                  <div key={i} style={{
                    padding: '15px',
                    marginBottom: '10px',
                    background: '#0a0e27',
                    border: '1px solid #00ff88',
                    borderLeft: `4px solid ${item.isDangerous ? '#ff0055' : '#00ff88'}`
                  }}>
                    <div style={{
                      fontSize: '12px',
                      marginBottom: '5px',
                      wordBreak: 'break-all',
                      color: item.isDangerous ? '#ff0055' : '#00ff88'
                    }}>
                      {item.isDangerous ? '❌' : '✅'} {item.finalURL || item.scannedURL}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>
                      คะแนน: {item.securityScore}% • {new Date(item.scanTimestamp + 'Z').toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Threat Database */}
          <div style={{
            background: 'rgba(6, 8, 19, 0.8)',
            border: '2px solid #ff0055',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#ff0055' }}>
              🚨 Top 10 URL อันตรายที่ถูกค้นพบ
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {threats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                  ยังไม่มีข้อมูล URL อันตราย
                </div>
              ) : (
                threats.map((threat, i) => (
                  <div key={i} style={{
                    padding: '15px',
                    marginBottom: '10px',
                    background: 'rgba(255, 0, 85, 0.1)',
                    border: '1px solid #ff0055'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      marginBottom: '5px',
                      wordBreak: 'break-all',
                      color: '#ff0055'
                    }}>
                      ❌ {threat.url}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>
                      คะแนนเฉลี่ย: {threat.avgSecurityScore}% • ตรวจพบ: {threat.scanCount} ครั้ง
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Report Panel */}
        <ReportPanel />

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid #00ff88',
          color: '#00ff88',
          opacity: 0.5,
          fontSize: '12px'
        }}>
          <p>© 2024 Link Security Scanner | Powered by VirusTotal API</p>
          <p>⚡ Built with React + Vite + Node.js</p>
        </div>
      </div>
    </div>
  );
}

export default App;
