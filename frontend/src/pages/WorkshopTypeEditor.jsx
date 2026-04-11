import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import LoadingState from '../components/common/LoadingState';
import { getErrorMessage } from '../services/api';
import { createWorkshopType, deleteAttachment, getWorkshopTypeDetail, updateWorkshopType } from '../services/workshopService';

const initialForm = {
  name: '',
  duration: '',
  description: '',
  terms_and_conditions: '',
};

export default function WorkshopTypeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [attachments, setAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }
    getWorkshopTypeDetail(id)
      .then((data) => {
        setForm({
          name: data.name,
          duration: String(data.duration),
          description: data.description,
          terms_and_conditions: data.termsAndConditions,
        });
        setAttachments(data.attachments || []);
      })
      .catch((err) => setError(getErrorMessage(err, 'Workshop type could not be loaded.')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      newFiles.forEach((file) => payload.append('attachments', file));

      const saved = id ? await updateWorkshopType(id, payload) : await createWorkshopType(payload);
      navigate(`/types/${saved.id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop type could not be saved.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAttachment = async (fileId) => {
    try {
      await deleteAttachment(id, fileId);
      setAttachments((current) => current.filter((file) => file.id !== fileId));
    } catch (err) {
      setError(getErrorMessage(err, 'Attachment could not be deleted.'));
    }
  };

  if (loading) {
    return <LoadingState label="Loading workshop type..." />;
  }

  return (
    <div className="page-shell narrow-shell">
      <Card>
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Instructor editor</p>
            <h1>{id ? 'Edit workshop type' : 'Create workshop type'}</h1>
          </div>
          <Link className="button-link button-link-muted" to="/types">Cancel</Link>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <Input label="Workshop name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Duration (days)" name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required />
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} required />
          <Textarea
            label="Terms and conditions"
            name="terms_and_conditions"
            value={form.terms_and_conditions}
            onChange={handleChange}
            required
          />
          <Input
            label="Add attachments"
            type="file"
            multiple
            onChange={(event) => setNewFiles(Array.from(event.target.files || []))}
            hint="You can select multiple files in one go."
          />

          {attachments.length ? (
            <div className="attachment-list">
              {attachments.map((file) => (
                <div className="attachment-row attachment-manage-row" key={file.id}>
                  <span>{file.name}</span>
                  <Button type="button" variant="ghost" onClick={() => handleDeleteAttachment(file.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          {error ? <div className="message-banner message-error">{error}</div> : null}
          <Button type="submit" fullWidth disabled={saving}>
            {saving ? 'Saving...' : id ? 'Save changes' : 'Create workshop type'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
