import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { motion } from 'framer-motion';
import { getThreatLevel, getThreatColor } from '../../utils/formatters';
import { THREAT_LEVELS } from '../../utils/constants';

const SecurityGauge = ({ score }) => {
  const threatLevel = getThreatLevel(score);
  const threatInfo = Object.values(THREAT_LEVELS).find(t => t.level === threatLevel);

  const getGaugeColor = (score) => {
    if (score <= 20) return '#00ff88';
    if (score <= 50) return '#ffaa00';
    return '#ff0055';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <GaugeComponent
          type="radial"
          arc={{
            colorArray: [getGaugeColor(score)],
            padding: 0.02,
            subArcs: []
          }}
          pointer={{
            elastic: true,
            animationDelay: 0
          }}
          labels={{
            valueLabel: {
              fontSize: 40,
              formatTextValue: value => value + '%',
              style: { fill: getGaugeColor(score), fontWeight: 'bold' }
            },
            tickLabels: {
              type: 'outer',
              ticks: [
                { value: 0 },
                { value: 20 },
                { value: 50 },
                { value: 100 }
              ]
            }
          }}
          value={score}
          minValue={0}
          maxValue={100}
        />

        {/* Pulse rings สำหรับ dangerous */}
        {threatLevel === 'dangerous' && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-cyber-red pulse-ring" 
                 style={{ animationDelay: '0s' }} />
            <div className="absolute inset-0 rounded-full border-4 border-cyber-red pulse-ring" 
                 style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <div className={`text-2xl font-bold mb-2`} 
             style={{ color: getThreatColor(threatLevel) }}>
          {threatInfo.icon} {threatInfo.message}
        </div>
        
        <div className="text-cyber-green/60 text-sm">
          คะแนนความปลอดภัย: {score}/100
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SecurityGauge;
