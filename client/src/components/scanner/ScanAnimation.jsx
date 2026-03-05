import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScanAnimation = () => {
  const [chars, setChars] = useState([]);

  useEffect(() => {
    // สร้าง Matrix rain characters
    const characters = 'ア  イ  ウ  エ  オ  カ  キ  ク  ケ  コ  サ  シ  ス  セ  ソ  タ  チ  ツ  テ  ト  ナ  ニ  ヌ  ネ  ノ  ハ  ヒ  フ  ヘ  ホ  マ  ミ  ム  メ  モ  ヤ  ユ  ヨ  ラ  リ  ル  レ  ロ  ワ  ヲ  ン 01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = characters.split('');
    const columns = 30;
    
    const newChars = Array.from({ length: columns }, (_, i) => ({
      id: i,
      char: charArray[Math.floor(Math.random() * charArray.length)],
      x: (i / columns) * 100,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2
    }));

    setChars(newChars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {chars.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-cyber-green matrix-char opacity-30"
          style={{
            left: `${item.x}%`,
            fontSize: '20px'
          }}
          animate={{
            y: ['- 100%', '100vh']
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'linear'
          }}
        >
          {item.char}
        </motion.div>
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50"
        animate={{
          y: ['0%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export default ScanAnimation;
