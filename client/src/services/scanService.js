import api from './api';

export const scanURL = async (url) => {
  try {
    const response = await api.post('/scan', { url });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Scan error:', error);
    return {
      success: false,
      error: {
        message: error.message || 'ไม่สามารถสแกน URL ได้'
      }
    };
  }
};
