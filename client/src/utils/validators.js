export const isValidURL = (string) => {
  try {
    // ถ้าไม่มี protocol ให้เติม https://
    const url = string.includes('://') ? string : `https://${string}`;
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const normalizeURL = (url) => {
  let normalized = url.trim();
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = 'https://' + normalized;
  }
  return normalized;
};

export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (_) {
    return '';
  }
};
