import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';
import './Register.css';

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const rules = {
  username: (v) => {
    if (!v) return 'Username is required.';
    if (!/^[a-zA-Z0-9._]+$/.test(v)) return 'Only letters, digits, period and underscore allowed.';
    if (v.length < 3) return 'Username must be at least 3 characters.';
    return '';
  },
  email: (v) => {
    if (!v) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Must include at least one uppercase letter.';
    if (!/[0-9]/.test(v)) return 'Must include at least one number.';
    return '';
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Please confirm your password.';
    if (v !== form.password) return 'Passwords do not match.';
    return '';
  },
};

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0–4
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = (field, value) => {
    const fn = rules[field];
    return fn ? fn(value, form) : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
    // Re-validate confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: rules.confirmPassword(form.confirmPassword, { ...form, password: value }),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Run all client-side validations first
    const allTouched = { username: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const newErrors = {
      username: rules.username(form.username),
      email: rules.email(form.email),
      password: rules.password(form.password),
      confirmPassword: rules.confirmPassword(form.confirmPassword, form),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((err) => !err);
    if (!isValid) return;

    // Submit to Django backend
    setLoading(true);
    try {
      const res = await register(form);

      // Django returns a 200 HTML page on success (activation.html)
      // and also a 200 with error-form HTML on duplicate username/email.
      // We inspect the response body text to distinguish the two.
      const html = typeof res.data === 'string' ? res.data : '';

      if (html.includes('already exists') || html.includes('Username already')) {
        // Django echoed validation errors back in HTML
        if (html.includes('email') && html.includes('already')) {
          setServerError('An account with this email already exists. Please use a different email.');
        } else {
          setServerError('This username is already taken. Please choose a different one.');
        }
      } else if (res.status >= 200 && res.status < 400) {
        // Genuine success — activation email sent
        setSubmitted(true);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } catch (err) {
      if (!err.response) {
        setServerError('Cannot reach the server. Make sure the Django backend is running on port 8000.');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  if (submitted) {
    return (
      <div className="reg-page">
        <div className="reg-card reg-success">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>
            Registration successful. Please check your email to activate your account.
          </p>
          <Link to="/login" className="reg-btn-full">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-page">
      <div className="reg-card">

        {/* Header */}
        <div className="reg-header">
          <div className="reg-logo">✧</div>
          <h1 className="reg-title">Create Account</h1>
          <p className="reg-subtitle">Join FOSSEE Workshops today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="reg-form">

          {/* Username */}
          <div className={`reg-field ${touched.username && errors.username ? 'has-error' : ''} ${touched.username && !errors.username && form.username ? 'has-success' : ''}`}>
            <label htmlFor="username" className="reg-label">Username</label>
            <div className="reg-input-wrap">
              <span className="reg-icon">@</span>
              <input
                id="username"
                name="username"
                type="text"
                className="reg-input"
                placeholder="john_doe"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
              />
              {touched.username && !errors.username && form.username && (
                <span className="reg-check">✓</span>
              )}
            </div>
            {touched.username && errors.username && (
              <p className="reg-error">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className={`reg-field ${touched.email && errors.email ? 'has-error' : ''} ${touched.email && !errors.email && form.email ? 'has-success' : ''}`}>
            <label htmlFor="email" className="reg-label">Email Address</label>
            <div className="reg-input-wrap">
              <span className="reg-icon">✉</span>
              <input
                id="email"
                name="email"
                type="email"
                className="reg-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              {touched.email && !errors.email && form.email && (
                <span className="reg-check">✓</span>
              )}
            </div>
            {touched.email && errors.email && (
              <p className="reg-error">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={`reg-field ${touched.password && errors.password ? 'has-error' : ''} ${touched.password && !errors.password && form.password ? 'has-success' : ''}`}>
            <label htmlFor="password" className="reg-label">Password</label>
            <div className="reg-input-wrap">
              <span className="reg-icon">⚿</span>
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="reg-input"
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reg-toggle"
                onClick={() => setShowPwd((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>

            {/* Strength meter */}
            {form.password && (
              <div className="strength-wrap">
                <div className="strength-bar">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= strength ? strengthColor[strength] : 'var(--border-color)' }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}

            {touched.password && errors.password && (
              <p className="reg-error">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className={`reg-field ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : ''} ${touched.confirmPassword && !errors.confirmPassword && form.confirmPassword ? 'has-success' : ''}`}>
            <label htmlFor="confirmPassword" className="reg-label">Confirm Password</label>
            <div className="reg-input-wrap">
              <span className="reg-icon">⚿</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="reg-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reg-toggle"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? '🙈' : '👁'}
              </button>
              {touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && (
                <span className="reg-check">✓</span>
              )}
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="reg-error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Server-side error banner */}
          {serverError && (
            <div className="reg-server-error" role="alert">
              <span className="reg-server-error-icon">⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="reg-btn-full" disabled={loading}>
            {loading ? (
              <span className="reg-spinner">Registering…</span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="reg-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="reg-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
