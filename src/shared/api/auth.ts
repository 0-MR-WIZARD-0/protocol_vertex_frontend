import { api } from './axios';

export const getMe = async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch {
    return null;
  }
};