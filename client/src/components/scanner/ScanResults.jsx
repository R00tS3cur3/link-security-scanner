import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import SecurityGauge from './SecurityGauge';
import { shortenURL, formatDate } from '../../utils/formatters';

const ScanResults = ({ result }) => {
  if (!result) return null;

  const { url, security, geolocation, whois, scanDate } = result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* URL Info */}
      {url.wasShortened && (
        <Card className="bg-cyber-orange/10 border-cyber-orange">
          <div className="text-cyber-orange">
            <p className="font-bold mb-2">⚠️ ตรวจพบลิงก์ย่อ</p>
            <p className="text-sm">Original: {shortenURL(url.normalized, 50)}</p>
            <p className="text-sm">→ Redirects to: {shortenURL(url.final, 50)}</p>
          </div>
        </Card>
      )}

      {/* Security Gauge */}
      <Card>
        <SecurityGauge score={security.score} />
      </Card>

      {/* Detailed Stats */}
      <Card>
        <h3 className="text-cyber-green font-bold text-xl mb-4">
          📊 รายละเอียดการสแกน
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-cyber-red/10 rounded">
            <div className="text-2xl font-bold text-cyber-red">
              {security.stats.malicious}
            </div>
            <div className="text-sm text-cyber-green/60">Malicious</div>
          </div>
          <div className="text-center p-4 bg-cyber-orange/10 rounded">
            <div className="text-2xl font-bold text-cyber-orange">
              {security.stats.suspicious}
            </div>
            <div className="text-sm text-cyber-green/60">Suspicious</div>
          </div>
          <div className="text-center p-4 bg-cyber-green/10 rounded">
            <div className="text-2xl font-bold text-cyber-green">
              {security.stats.harmless}
            </div>
            <div className="text-sm text-cyber-green/60">Harmless</div>
          </div>
          <div className="text-center p-4 bg-cyber-blue/10 rounded">
            <div className="text-2xl font-bold text-cyber-blue">
              {security.stats.total}
            </div>
            <div className="text-sm text-cyber-green/60">Total Engines</div>
          </div>
        </div>

        {/* Detected By */}
        {security.detectedBy && security.detectedBy.length > 0 && (
          <div className="mt-6">
            <h4 className="text-cyber-red font-bold mb-3">
              🚨 ตรวจพบโดย ({security.detectedBy.length} engines):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {security.detectedBy.map((engine, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 bg-cyber-darker border border-cyber-red/30 rounded text-sm"
                >
                  <span className="text-cyber-red font-bold">{engine.name}</span>
                  <span className="text-cyber-green/60 ml-2">
                    {engine.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Geolocation Info */}
      {geolocation && (
        <Card>
          <h3 className="text-cyber-green font-bold text-xl mb-4">
            🌍 ข้อมูลตำแหน่งที่ตั้งเซิร์ฟเวอร์
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-cyber-green/60">Country:</span>
              <p className="text-xl">
                {geolocation.flag} {geolocation.country}
              </p>
            </div>
            <div>
              <span className="text-cyber-green/60">City:</span>
              <p className="text-xl">{geolocation.city}</p>
            </div>
            <div>
              <span className="text-cyber-green/60">IP Address:</span>
              <p className="text-xl font-mono">{geolocation.ip}</p>
            </div>
            <div>
              <span className="text-cyber-green/60">Organization:</span>
              <p className="text-xl">{geolocation.organization}</p>
            </div>
          </div>
        </Card>
      )}

      {/* WHOIS Info */}
      <Card>
        <h3 className="text-cyber-green font-bold text-xl mb-4">
          📝 ข้อมูลโดเมน
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-cyber-green/60">Domain:</span>
            <p className="text-xl font-mono">{url.domain}</p>
          </div>
          <div>
            <span className="text-cyber-green/60">Registrar:</span>
            <p className="text-xl">{whois.registrar}</p>
          </div>
          <div>
            <span className="text-cyber-green/60">Domain Age:</span>
            <p className="text-xl">{whois.domainAgeText}</p>
          </div>
          <div>
            <span className="text-cyber-green/60">Created:</span>
            <p className="text-xl">
              {whois.createdDate ? formatDate(whois.createdDate) : 'Unknown'}
            </p>
          </div>
        </div>
      </Card>

      {/* Scan Info */}
      <div className="text-center text-cyber-green/40 text-sm">
        <p>สแกนเมื่อ: {formatDate(scanDate)}</p>
      </div>
    </motion.div>
  );
};

export default ScanResults;
