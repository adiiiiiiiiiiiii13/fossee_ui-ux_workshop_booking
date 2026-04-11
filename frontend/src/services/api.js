import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use((config) => {
  const unsafeMethods = ['post', 'put', 'patch', 'delete'];
  if (unsafeMethods.includes((config.method || 'get').toLowerCase())) {
    const csrf = getCookie('csrftoken');
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf;
    }
  }
  return config;
});

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || fallback;
}

export default api;
