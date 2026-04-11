import api from './api';

export async function fetchSession() {
  const response = await api.get('/auth/session/');
  return response.data.data;
}

export async function login(payload) {
  const response = await api.post('/auth/login/', payload);
  return response.data.data;
}

export async function register(payload) {
  const response = await api.post('/auth/register/', payload);
  return response.data.data;
}

export async function logout() {
  const response = await api.post('/auth/logout/');
  return response.data;
}
