import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import FormGrid from '../components/forms/FormGrid';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { useAsync } from '../hooks/useAsync';
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
  const { values: form, errors, handleChange, setFormErrors, setValues } = useForm(initialForm);
  const { loading, error, execute } = useAsync();
  const [choices, setChoices] = useState({ titles: [], departments: [], states: [], sources: [] });

  useEffect(() => {
    const loadChoices = async () => {
      try {
        const data = await execute(
          () => getChoices(),
          'Registration choices could not be loaded.'
        );
        
        setChoices(data);
        
        setValues(current => ({
          ...current,
          title: data.titles[0]?.value || '',
          department: data.departments[0]?.value || '',
          state: data.states[0]?.value || '',
          how_did_you_hear_about_us: data.sources[0]?.value || '',
        }));
      } catch (err) {
        // Error is handled by useAsync hook
      }
    };

    loadChoices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
  return (
    <div className="auth-shell">
      <Card className="auth-card auth-card-wide">
        <p className="eyebrow">Coordinator registration</p>
        <h1>Create your workshop account</h1>
        <p className="muted-text">
          Instructor access is still managed by admin. This form creates a coordinator account that can propose workshops.
        </p>

        <FormGrid>
          <form onSubmit={handleSubmit}>
            <FormField 
              label="Username" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              error={errors.username?.[0]} 
              required 
            />
            <FormField 
              label="Email" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              error={errors.email?.[0]} 
              required 
            />
            <FormField 
              label="Password" 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              error={errors.password?.[0]} 
              required 
            />
            <FormField 
              label="Confirm password" 
              type="password" 
              name="confirm_password" 
              value={form.confirm_password} 
              onChange={handleChange} 
              error={errors.confirm_password?.[0]} 
              required 
            />
            <FormField 
              type="select"
              label="Title" 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              error={errors.title?.[0]} 
              required
            >
              {choices?.titles?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FormField>
            <FormField 
              label="First name" 
              name="first_name" 
              value={form.first_name} 
              onChange={handleChange} 
              error={errors.first_name?.[0]} 
              required 
            />
            <FormField 
              label="Last name" 
              name="last_name" 
              value={form.last_name} 
              onChange={handleChange} 
              error={errors.last_name?.[0]} 
              required 
            />
            <FormField 
              label="Phone number" 
              name="phone_number" 
              value={form.phone_number} 
              onChange={handleChange} 
              error={errors.phone_number?.[0]} 
              required 
            />
            <FormField 
              label="Institute" 
              name="institute" 
              value={form.institute} 
              onChange={handleChange} 
              error={errors.institute?.[0]} 
              required 
            />
            <FormField 
              type="select"
              label="Department" 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              error={errors.department?.[0]} 
              required
            >
              {choices?.departments?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FormField>
            <FormField 
              label="Location" 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              error={errors.location?.[0]} 
              required 
            />
            <FormField 
              type="select"
              label="State" 
              name="state" 
              value={form.state} 
              onChange={handleChange} 
              error={errors.state?.[0]} 
              required
            >
              {choices?.states?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FormField>
            <FormField
              type="select"
              label="How did you hear about us?"
              name="how_did_you_hear_about_us"
              value={form.how_did_you_hear_about_us}
              onChange={handleChange}
              error={errors.how_did_you_hear_about_us?.[0]}
              required
              className="full-span"
            >
              {choices?.sources?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FormField>

            {error && <div className="message-banner message-error full-span">{error}</div>}
            
            <div className="full-span">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </FormGrid>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in here</Link>.
        </p>
      </Card>
    </div>
  );
}
