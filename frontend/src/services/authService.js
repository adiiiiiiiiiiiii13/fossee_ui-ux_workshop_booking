/**
 * authService.js
 *
 * Wraps Django auth endpoints:
 *   POST /workshop/login/    → user_login
 *   GET  /workshop/logout/   → user_logout
 *   POST /workshop/register/ → user_register
 *
 * Note: Django uses session-based auth. A successful login sets a session
 * cookie automatically. The Axios instance (api.js) forwards it with
 * `withCredentials: true`.
 *
 * Django's login view returns an HTML redirect on success, not JSON.
 * We treat a non-4xx response as a successful login.
 */
import api from './api';

/**
 * Login with username + password.
 * @param {{ username: string, password: string }} credentials
 */
export const login = ({ username, password }) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/workshop/login/', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Don't throw on 3xx redirect — Django redirects on success
    maxRedirects: 0,
    validateStatus: (status) => status < 400,
  });
};

/**
 * Logout the current user.
 */
export const logout = () => api.get('/workshop/logout/');

/**
 * Register a new user.
 * @param {{ firstName: string, lastName: string, username: string,
 *           email: string, password: string, position: string }} data
 */
export const register = (data) => {
  const formData = new URLSearchParams();
  formData.append('first_name', data.firstName);
  formData.append('last_name', data.lastName);
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('confirm_password', data.password);
  formData.append('position', data.position);
  return api.post('/workshop/register/', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    validateStatus: (status) => status < 400,
  });
};
