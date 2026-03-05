import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const CardComponent = animate ? motion.div : 'div';
  const props = animate ? { variants: cardVariants, initial: 'hidden', animate: 'visible' } : {};

  return (
    <CardComponent 
      className={`card-cyber ${className}`}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
