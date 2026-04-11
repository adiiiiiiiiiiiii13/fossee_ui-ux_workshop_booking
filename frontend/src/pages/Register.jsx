import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { getChoices } from '../services/workshopService';

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  title: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  institute: '',
  department: '',
  location: '',
  state: '',
  how_did_you_hear_about_us: '',
};

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [choices, setChoices] = useState({ titles: [], departments: [], states: [], sources: [] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    getChoices()
      .then((data) => {
        setChoices(data);
        setForm((current) => ({
          ...current,
          title: data.titles[0]?.value || '',
          department: data.departments[0]?.value || '',
          state: data.states[0]?.value || '',
          how_did_you_hear_about_us: data.sources[0]?.value || '',
        }));
      })
      .catch(() => {
        setBanner('Registration choices could not be loaded. Refresh and try again.');
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setBanner('');
    setErrors({});

    try {
      const result = await registerUser(form);
      // Redirect to activation pending page with state
      navigate('/activation-pending', {
        state: {
          devActivationUrl: result?.devActivationUrl || '',
          email: form.email,
        },
      });
    } catch (err) {
      const fieldErrors = err?.response?.data?.errors || {};
      const detail = Object.values(fieldErrors)
        .flat()
        .filter(Boolean)
        .join(' ');
      const headline = getErrorMessage(err, 'Registration failed.');
      setBanner(detail ? `${headline} ${detail}`.trim() : headline);
      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card auth-card-wide">
        <p className="eyebrow">Coordinator registration</p>
        <h1>Create your workshop account</h1>
        <p className="muted-text">
          Instructor access is still managed by admin. This form creates a coordinator account that can propose workshops.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <Input label="Username" id="username" name="username" value={form.username} onChange={handleChange} error={errors.username?.[0]} required />
          <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} required />
          <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password?.[0]} required />
          <Input label="Confirm password" id="confirm_password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} error={errors.confirm_password?.[0]} required />
          <Select label="Title" id="title" name="title" value={form.title} onChange={handleChange} error={errors.title?.[0]} required>
            {choices.titles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="First name" id="first_name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name?.[0]} required />
          <Input label="Last name" id="last_name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name?.[0]} required />
          <Input label="Phone number" id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} error={errors.phone_number?.[0]} required />
          <Input label="Institute" id="institute" name="institute" value={form.institute} onChange={handleChange} error={errors.institute?.[0]} required />
          <Select label="Department" id="department" name="department" value={form.department} onChange={handleChange} error={errors.department?.[0]} required>
            {choices.departments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="Location" id="location" name="location" value={form.location} onChange={handleChange} error={errors.location?.[0]} required />
          <Select label="State" id="state" name="state" value={form.state} onChange={handleChange} error={errors.state?.[0]} required>
            {choices.states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Select
            label="How did you hear about us?"
            id="how_did_you_hear_about_us"
            name="how_did_you_hear_about_us"
            value={form.how_did_you_hear_about_us}
            onChange={handleChange}
            error={errors.how_did_you_hear_about_us?.[0]}
            required
            className="full-span"
          >
            {choices.sources.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>

          {banner ? <div className="message-banner message-error full-span">{banner}</div> : null}
          <div className="full-span">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in here</Link>.
        </p>
      </Card>
    </div>
  );
}
