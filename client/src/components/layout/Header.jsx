import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="py-8 border-b border-cyber-green/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-cyber-green cyber-glow mb-2"
            animate={{ 
              textShadow: [
                '0 0 10px #00ff88, 0 0 20px #00ff88',
                '0 0 20px #00ff88, 0 0 40px #00ff88',
                '0 0 10px #00ff88, 0 0 20px #00ff88'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔒 LINK SECURITY SCANNER
          </motion.h1>
          <p className="text-cyber-green/60 text-lg">
            ตรวจสอบความปลอดภัยของ URL ก่อนเข้าใช้งาน
          </p>
          <p className="text-cyber-green/40 text-sm mt-2">
            Powered by VirusTotal API
          </p>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
