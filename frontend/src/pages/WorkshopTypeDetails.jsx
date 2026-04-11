import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { getWorkshopTypeDetail } from '../services/workshopService';

export default function WorkshopTypeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [workshopType, setWorkshopType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getWorkshopTypeDetail(id)
      .then(setWorkshopType)
      .catch((err) => setError(getErrorMessage(err, 'Workshop type details could not be loaded.')))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingState label="Loading workshop details..." />;
  }

  return (
    <div className="page-shell narrow-shell">
      {error ? <div className="message-banner message-error">{error}</div> : null}
      {workshopType ? (
        <Card className="detail-card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Workshop type</p>
              <h1>{workshopType.name}</h1>
            </div>
            {user?.isInstructor ? (
              <Link className="button-link button-link-primary" to={`/types/${workshopType.id}/edit`}>Edit</Link>
            ) : null}
          </div>
          <dl className="detail-grid">
            <div><dt>Duration</dt><dd>{workshopType.duration} day(s)</dd></div>
            <div><dt>Description</dt><dd>{workshopType.description}</dd></div>
            <div><dt>Terms and conditions</dt><dd>{workshopType.termsAndConditions}</dd></div>
          </dl>

          <div className="attachment-list">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Downloads</p>
                <h2>Attachments</h2>
              </div>
            </div>
            {workshopType.attachments?.length ? (
              workshopType.attachments.map((file) => (
                <a className="attachment-row" key={file.id} href={file.url} target="_blank" rel="noreferrer">
                  {file.name}
                </a>
              ))
            ) : (
              <p className="muted-text">No attachments uploaded yet.</p>
            )}
          </div>

          <div className="inline-actions">
            <Link className="button-link button-link-muted" to="/types">Back to list</Link>
            {!user?.isInstructor ? <Link className="button-link button-link-primary" to="/propose">Propose this workshop</Link> : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
