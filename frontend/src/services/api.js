/**
 * api.js — Centralized Axios instance
 *
 * All requests go to the Django backend via the Vite proxy (see vite.config.js).
 * Django uses session-based auth with CSRF protection.
 * We read the csrftoken cookie and forward it on every mutating request.
 */
import axios from 'axios';

// Helper: read a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: '/',         // Vite proxies /workshop/* → Django :8000
  withCredentials: true, // Required for session cookie to be sent
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Attach CSRF token to all unsafe methods before the request leaves
api.interceptors.request.use((config) => {
  const unsafeMethods = ['post', 'put', 'patch', 'delete'];
  if (unsafeMethods.includes(config.method)) {
    const csrf = getCookie('csrftoken');
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf;
    }
  }
  return config;
});

export default api;
