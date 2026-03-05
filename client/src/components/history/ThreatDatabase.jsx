import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Loading from '../common/Loading';
import { getTopThreats } from '../../services/threatService';
import { shortenURL, formatDate } from '../../utils/formatters';

const ThreatDatabase = ({ refreshTrigger }) => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreats();
  }, [refreshTrigger]);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const response = await getTopThreats();
      setThreats(response.data.items);
    } catch (error) {
      console.error('Failed to load threats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyber-red mb-6">
        🚨 Top 10 URL อันตรายที่ถูกรายงาน
      </h2>

      {loading ? (
        <Loading text="กำลังโหลดข้อมูล..." />
      ) : threats.length === 0 ? (
        <div className="text-center py-12 text-cyber-green/40">
          <p className="text-xl">ยังไม่มีข้อมูล URL อันตราย</p>
        </div>
      ) : (
        <div className="space-y-3">
          {threats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-cyber-red/10 border border-cyber-red/30 rounded hover:bg-cyber-red/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-cyber-red">
                      #{index + 1}
                    </span>
                    <p className="font-mono text-sm text-cyber-green">
                      {shortenURL(threat.url, 50)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-cyber-green/60">รายงาน:</span>
                      <span className="text-cyber-red font-bold ml-2">
                        {threat.scanCount} ครั้ง
                      </span>
                    </div>
                    <div>
                      <span className="text-cyber-green/60">คะแนนเฉลี่ย:</span>
                      <span className="text-cyber-red font-bold ml-2">
                        {threat.avgSecurityScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-cyber-green/60">สูงสุด:</span>
                      <span className="text-cyber-red font-bold ml-2">
                        {threat.maxSecurityScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-cyber-green/60">โดเมน:</span>
                      <span className="text-cyber-green/80 ml-2">
                        {threat.domain}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-cyber-green/40">
                    ตรวจพบครั้งแรก: {formatDate(threat.firstDetected)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ThreatDatabase;
