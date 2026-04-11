import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import LoadingState from '../components/common/LoadingState';
import { getErrorMessage } from '../services/api';
import { getChoices, getOwnProfile, updateOwnProfile } from '../services/workshopService';

export default function Profile() {
  const [choices, setChoices] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getChoices(), getOwnProfile()])
      .then(([choiceData, profile]) => {
        setChoices(choiceData);
        setForm({
          title: profile.title || choiceData.titles[0]?.value || '',
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_number: profile.phoneNumber,
          institute: profile.institute,
          department: profile.department,
          position: profile.position,
          location: profile.location,
          state: profile.state,
        });
      })
      .catch((err) => setError(getErrorMessage(err, 'Profile could not be loaded.')))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateOwnProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Profile could not be updated.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="page-shell narrow-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Your profile</p>
          <h1>Update your details</h1>
          <p className="muted-text">Keep your contact information current so workshop communication reaches the right place.</p>
        </div>
      </section>

      <Card>
        <form className="form-grid" onSubmit={handleSubmit}>
          <Select label="Title" name="title" value={form.title} onChange={handleChange}>
            {choices.titles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="First name" name="first_name" value={form.first_name} onChange={handleChange} required />
          <Input label="Last name" name="last_name" value={form.last_name} onChange={handleChange} required />
          <Input label="Phone number" name="phone_number" value={form.phone_number} onChange={handleChange} required />
          <Input label="Institute" name="institute" value={form.institute} onChange={handleChange} required />
          <Select label="Department" name="department" value={form.department} onChange={handleChange}>
            {choices.departments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Select label="Position" name="position" value={form.position} onChange={handleChange}>
            {choices.positions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
          <Select label="State" name="state" value={form.state} onChange={handleChange}>
            {choices.states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          {error ? <div className="message-banner message-error full-span">{error}</div> : null}
          {message ? <div className="message-banner message-success full-span">{message}</div> : null}
          <div className="full-span">
            <Button type="submit" fullWidth disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
