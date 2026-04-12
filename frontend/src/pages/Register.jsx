import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { useAsync } from '../hooks/useAsync';
import { getChoices } from '../services/workshopService';
import './Register.css';

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
    
    try {
      const result = await execute(
        () => registerUser(form),
        'Registration failed.'
      );
      
      navigate('/activation-pending', {
        state: {
          devActivationUrl: result?.devActivationUrl || '',
          email: form.email,
        },
      });
    } catch (err) {
      const fieldErrors = err?.response?.data?.errors || {};
      setFormErrors(fieldErrors);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="register-card">
        <div className="register-header">
          <p className="eyebrow">Coordinator registration</p>
          <h1>Create your workshop account</h1>
          <p className="muted-text">
            Instructor access is managed by admin. Create a coordinator account to propose workshops.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Account Details */}
          <div className="form-section">
            <h3 className="section-title">Account Details</h3>
            <div className="form-row">
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
            </div>
            <div className="form-row">
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
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
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
                label="Phone number" 
                name="phone_number" 
                value={form.phone_number} 
                onChange={handleChange} 
                error={errors.phone_number?.[0]} 
                required 
              />
            </div>
            <div className="form-row">
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
            </div>
          </div>

          {/* Institution Details */}
          <div className="form-section">
            <h3 className="section-title">Institution Details</h3>
            <div className="form-row">
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
            </div>
            <div className="form-row">
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
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <FormField
              type="select"
              label="How did you hear about us?"
              name="how_did_you_hear_about_us"
              value={form.how_did_you_hear_about_us}
              onChange={handleChange}
              error={errors.how_did_you_hear_about_us?.[0]}
              required
            >
              {choices?.sources?.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FormField>
          </div>

          {error && <div className="message-banner message-error">{error}</div>}
          
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in here</Link>.
        </p>
      </Card>
    </div>
  );
}
