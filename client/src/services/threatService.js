import api from './api';

export const getTopThreats = async () => {
  const response = await api.get('/threats/top10');
  return response.data;
};

export const getAllThreats = async () => {
  const response = await api.get('/threats');
  return response.data;
};

export const getThreatCount = async () => {
  const response = await api.get('/threats/count');
  return response.data;
};
