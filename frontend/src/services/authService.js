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
 * Django's views return HTML, not JSON.
 * We treat a non-4xx response as success (Django redirects/renders on success).
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
 *
 * Django's UserRegistrationForm requires many fields beyond what we show
 * in the minimal UI. We send all required fields; hidden ones use safe defaults.
 * The user can update their profile details later from the profile page.
 *
 * Required by Django's form:
 *   username, email, password, confirm_password,
 *   title, first_name, last_name, phone_number,
 *   institute, department, location, state, how_did_you_hear_about_us
 *
 * @param {{ username: string, email: string, password: string, confirmPassword: string }} data
 * @returns {Promise} Resolves on HTTP 2xx/3xx, rejects on 4xx/5xx
 */
export const register = (data) => {
  const formData = new URLSearchParams();

  // --- Fields from the UI ---
  formData.append('username', data.username.trim().toLowerCase());
  formData.append('email', data.email.trim());
  formData.append('password', data.password);
  formData.append('confirm_password', data.confirmPassword);

  // --- Required by Django form — sensible defaults for hidden fields ---
  // Django coerces username as first_name placeholder; user updates profile later
  formData.append('first_name', data.username.trim());
  formData.append('last_name', '.');
  formData.append('title', 'Mr');
  formData.append('phone_number', '0000000000');   // 10-digit placeholder
  formData.append('institute', 'Not specified');
  formData.append('department', 'computer engineering');
  formData.append('location', 'Not specified');
  formData.append('state', 'IN-MH');
  formData.append('how_did_you_hear_about_us', 'FOSSEE website');

  return api.post('/workshop/register/', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Django renders activation.html (2xx) on success, or form HTML on errors
    validateStatus: (status) => status < 500,
  });
};
