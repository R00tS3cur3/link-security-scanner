export const THREAT_LEVELS = {
  SAFE: {
    level: 'safe',
    color: 'cyber-green',
    icon: '✅',
    message: 'ปลอดภัย - สามารถเข้าใช้งานได้',
    range: [0, 20]
  },
  SUSPICIOUS: {
    level: 'suspicious',
    color: 'cyber-orange',
    icon: '⚠️',
    message: 'ระวัง - พบสัญญาณน่าสงสัย',
    range: [21, 50]
  },
  DANGEROUS: {
    level: 'dangerous',
    color: 'cyber-red',
    icon: '❌',
    message: 'อันตราย - อย่าเข้าเด็ดขาด!',
    range: [51, 100]
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const HISTORY_FILTERS = {
  ALL: 'all',
  DANGEROUS: 'dangerous',
  SAFE: 'safe'
};

export const SCAN_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SCANNING: 'scanning',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const GAUGE_CONFIG = {
  safe: {
    startColor: '#00ff88',
    endColor: '#00ff88',
    minValue: 0,
    maxValue: 20
  },
  suspicious: {
    startColor: '#ffaa00',
    endColor: '#ffaa00',
    minValue: 21,
    maxValue: 50
  },
  dangerous: {
    startColor: '#ff0055',
    endColor: '#ff0055',
    minValue: 51,
    maxValue: 100
  }
};
