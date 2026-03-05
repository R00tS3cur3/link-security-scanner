import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { isValidURL } from '../../utils/validators';

const ScanForm = ({ onScan, isScanning }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('กรุณาใส่ URL');
      return;
    }

    if (!isValidURL(url)) {
      setError('รูปแบบ URL ไม่ถูกต้อง');
      return;
    }

    onScan(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ใส่ URL ที่ต้องการตรวจสอบ (เช่น https://example.com)"
            className="input-cyber"
            disabled={isScanning}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-cyber-red text-sm"
            >
              ⚠️ {error}
            </motion.p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isScanning}
          loading={isScanning}
          className="w-full"
        >
          {isScanning ? 'กำลังสแกน...' : '🔍 สแกนตอนนี้'}
        </Button>
      </form>

      <div className="mt-6 text-center text-cyber-green/60 text-sm">
        <p>💡 รองรับการตรวจจับและแก้ลิงก์ย่อ (bit.ly, tinyurl, etc.)</p>
      </div>
    </motion.div>
  );
};

export default ScanForm;
