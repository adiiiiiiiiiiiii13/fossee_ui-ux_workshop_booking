import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(form);
      navigate(redirectTo || (user.isInstructor ? '/dashboard' : '/status'));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to your workshop workspace</h1>
        <p className="muted-text">
          Use your existing account to manage workshop proposals, approvals, comments, and profile details.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <Input
            id="username"
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error ? <div className="message-banner message-error">{error}</div> : null}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-footer">
          Need a coordinator account? <Link to="/register">Create one here</Link>.
        </p>
      </Card>
    </div>
  );
}
