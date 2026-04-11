import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import LoadingState from '../components/common/LoadingState';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { addWorkshopComment, getWorkshopDetail } from '../services/workshopService';

export default function WorkshopDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [comment, setComment] = useState({ comment: '', public: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadWorkshop = async () => {
    setLoading(true);
    try {
      const data = await getWorkshopDetail(id);
      setWorkshop(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop details could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshop();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const newComment = await addWorkshopComment(id, comment);
      setWorkshop((current) => ({ ...current, comments: [newComment, ...(current.comments || [])] }));
      setComment({ comment: '', public: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Comment could not be posted.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading workshop details..." />;
  }

  return (
    <div className="page-shell narrow-shell">
      {error ? <div className="message-banner message-error">{error}</div> : null}
      {workshop ? (
        <>
          <Card className="detail-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Workshop record</p>
                <h1>{workshop.workshopType.name}</h1>
              </div>
              <StatusBadge status={workshop.statusLabel} />
            </div>
            <dl className="detail-grid">
              <div><dt>Date</dt><dd>{workshop.date}</dd></div>
              <div><dt>Coordinator</dt><dd>{workshop.coordinator.name}</dd></div>
              <div><dt>Instructor</dt><dd>{workshop.instructor?.name || 'Pending'}</dd></div>
              <div><dt>Institute</dt><dd>{workshop.coordinator.institute}</dd></div>
            </dl>
            <div className="inline-actions">
              <Link className="button-link button-link-muted" to="/types">Back to workshop types</Link>
              <Link className="button-link button-link-primary" to={`/types/${workshop.workshopType.id}`}>View workshop type</Link>
            </div>
          </Card>

          <Card>
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Discussion</p>
                <h2>Comments</h2>
              </div>
            </div>
            <form className="form-stack" onSubmit={handleSubmit}>
              <Textarea label="Add a comment" value={comment.comment} onChange={(event) => setComment((current) => ({ ...current, comment: event.target.value }))} required />
              {user?.isInstructor ? (
                <label className="checkbox-row">
                  <input type="checkbox" checked={comment.public} onChange={(event) => setComment((current) => ({ ...current, public: event.target.checked }))} />
                  <span>Visible to coordinators</span>
                </label>
              ) : null}
              <Button type="submit" disabled={saving}>{saving ? 'Posting...' : 'Post comment'}</Button>
            </form>

            <div className="comment-stack">
              {workshop.comments?.length ? (
                workshop.comments.map((item) => (
                  <article key={item.id} className="comment-card">
                    <div className="comment-head">
                      <strong>{item.authorName}</strong>
                      <span>{item.createdDate}</span>
                    </div>
                    {!item.public ? <span className="small-pill">Hidden from coordinators</span> : null}
                    <p>{item.comment}</p>
                  </article>
                ))
              ) : (
                <p className="muted-text">No comments yet.</p>
              )}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
