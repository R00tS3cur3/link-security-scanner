export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'เมื่อสักครู่';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} นาทีที่แล้ว`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ชั่วโมงที่แล้ว`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} วันที่แล้ว`;
  } else {
    return formatDate(dateString);
  }
};

export const shortenURL = (url, maxLength = 40) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
};

export const getThreatLevel = (score) => {
  if (score <= 20) return 'safe';
  if (score <= 50) return 'suspicious';
  return 'dangerous';
};

export const getThreatColor = (level) => {
  const colors = {
    safe: '#00ff88',
    suspicious: '#ffaa00',
    dangerous: '#ff0055'
  };
  return colors[level] || '#00ff88';
};
