import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  className = '' 
}) => {
  const variants = {
    primary: 'btn-cyber',
    danger: 'bg-cyber-red/10 border-cyber-red text-cyber-red hover:bg-cyber-red/20',
    secondary: 'bg-cyber-blue/10 border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 border-2 font-bold uppercase tracking-wider
        transition-all duration-300 rounded-none relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          กำลังประมวลผล...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
