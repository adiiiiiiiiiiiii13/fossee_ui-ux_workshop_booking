import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { getErrorMessage } from '../services/api';
import { getChoices, getWorkshopTnc, proposeWorkshop } from '../services/workshopService';

export default function ProposeWorkshop() {
  const [choices, setChoices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tncText, setTncText] = useState('');
  const [form, setForm] = useState({
    workshopTypeId: '',
    date: '',
    tncAccepted: false,
  });

  useEffect(() => {
    getChoices()
      .then((data) => {
        setChoices(data);
        setForm((current) => ({
          ...current,
          workshopTypeId: data.workshopTypes[0]?.id ? String(data.workshopTypes[0].id) : '',
        }));
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Workshop choices could not be loaded.'));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!form.workshopTypeId) {
      setTncText('');
      return;
    }
    getWorkshopTnc(form.workshopTypeId)
      .then(setTncText)
      .catch(() => setTncText(''));
  }, [form.workshopTypeId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await proposeWorkshop(form);
      setMessage('Workshop proposal submitted successfully.');
      setForm((current) => ({ ...current, date: '', tncAccepted: false }));
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop proposal failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading proposal form..." />;
  }

  const hasWorkshopTypes = Boolean(choices?.workshopTypes?.length);

  return (
    <div className="page-shell narrow-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Coordinator action</p>
          <h1>Propose a workshop</h1>
          <p className="muted-text">Select a workshop type, choose a date, and submit it for instructor approval.</p>
        </div>
      </section>

      <Card>
        {hasWorkshopTypes ? (
          <form className="form-stack" onSubmit={handleSubmit}>
            <Select label="Workshop type" name="workshopTypeId" value={form.workshopTypeId} onChange={handleChange} required>
              {choices?.workshopTypes?.map((item) => (
                <option key={item.id} value={item.id}>{item.name} ({item.duration} day)</option>
              ))}
            </Select>
            <Input label="Preferred date" type="date" name="date" value={form.date} onChange={handleChange} required />
            <label className="checkbox-row">
              <input type="checkbox" name="tncAccepted" checked={form.tncAccepted} onChange={handleChange} />
              <span>I accept the workshop terms and conditions.</span>
            </label>

            {tncText ? (
              <div className="tnc-box">
                <strong>Terms and conditions</strong>
                <p>{tncText}</p>
              </div>
            ) : null}

            {error ? <div className="message-banner message-error">{error}</div> : null}
            {message ? <div className="message-banner message-success">{message}</div> : null}

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit proposal'}
            </Button>
          </form>
        ) : (
          <EmptyState
            title="No workshop types available"
            description="There are no workshop types available yet, so this proposal form cannot show any options. An instructor or admin needs to create workshop types first."
            action={<Link className="button-link button-link-muted" to="/types">Open workshop types</Link>}
          />
        )}
      </Card>
    </div>
  );
}
