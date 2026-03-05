import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ text = 'กำลังโหลด...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 border-4 border-cyber-green border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-cyber-green">{text}</p>
    </div>
  );
};

export default Loading;
