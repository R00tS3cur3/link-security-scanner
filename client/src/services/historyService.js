import api from './api';

export const getHistory = async (filter = 'all') => {
  let endpoint = '/history';
  
  if (filter === 'dangerous') {
    endpoint = '/history/dangerous';
  } else if (filter === 'safe') {
    endpoint = '/history/safe';
  }
  
  const response = await api.get(endpoint);
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/history/stats');
  return response.data;
};
