import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { getHistory, clearHistory } from '../../services/historyService';
import { formatTimeAgo, shortenURL, getThreatColor } from '../../utils/formatters';

const HistoryPanel = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [filter, refreshTrigger]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getHistory(filter);
      setHistory(response.data.items);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyber-green">
          📜 ประวัติการสแกน
        </h2>
        {history.length > 0 && (
          <Button 
            variant="danger" 
            onClick={() => setShowConfirm(true)}
            className="text-sm px-4 py-2"
          >
            🗑️ ล้างประวัติ
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'dangerous', 'safe'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 border-2 text-sm font-bold uppercase
              transition-all duration-300
              ${filter === f 
                ? 'bg-cyber-green/20 border-cyber-green text-cyber-green' 
                : 'bg-transparent border-cyber-green/30 text-cyber-green/60 hover:border-cyber-green/50'
              }
            `}
          >
            {f === 'all' && '🔍 ทั้งหมด'}
            {f === 'dangerous' && '❌ อันตราย'}
            {f === 'safe' && '✅ ปลอดภัย'}
          </button>
        ))}
      </div>

      {/* History List */}
      {loading ? (
        <Loading text="กำลังโหลดประวัติ..." />
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-cyber-green/40">
          <p className="text-xl">ไม่มีประวัติการสแกน</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-cyber-darker border border-cyber-green/20 rounded hover:border-cyber-green/40 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p 
                      className="font-mono text-sm mb-1"
                      style={{ color: getThreatColor(item.isDangerous ? 'dangerous' : 'safe') }}
                    >
                      {item.isDangerous ? '❌' : '✅'} {shortenURL(item.finalURL || item.scannedURL, 60)}
                    </p>
                    {item.wasShortened && (
                      <p className="text-xs text-cyber-orange">
                        ⚠️ ลิงก์ย่อ: {shortenURL(item.scannedURL, 50)}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div 
                      className="text-xl font-bold"
                      style={{ color: getThreatColor(item.securityScore <= 20 ? 'safe' : item.securityScore <= 50 ? 'suspicious' : 'dangerous') }}
                    >
                      {item.securityScore}%
                    </div>
                    <div className="text-xs text-cyber-green/40">
                      {formatTimeAgo(item.scanTimestamp)}
                    </div>
                  </div>
                </div>
                
                {item.country && (
                  <div className="text-xs text-cyber-green/60">
                    🌍 {item.country} • 📍 {item.ipAddress}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cyber-darker border-2 border-cyber-red p-8 max-w-md"
          >
            <h3 className="text-xl font-bold text-cyber-red mb-4">
              ⚠️ ยืนยันการลบประวัติ
            </h3>
            <p className="text-cyber-green/80 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการสแกนทั้งหมด?
            </p>
            <div className="flex gap-4">
              <Button 
                variant="danger" 
                onClick={handleClearHistory}
                className="flex-1"
              >
                ลบทั้งหมด
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Card>
  );
};

export default HistoryPanel;
