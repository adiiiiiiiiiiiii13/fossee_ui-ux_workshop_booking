import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import LoadingState from '../components/common/LoadingState';
import StatusBadge from '../components/common/StatusBadge';
import { getErrorMessage } from '../services/api';
import { getPublicProfile } from '../services/workshopService';

export default function PublicProfile() {
  const { userId } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicProfile(userId)
      .then(setPayload)
      .catch((err) => setError(getErrorMessage(err, 'Profile could not be loaded.')))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="page-shell narrow-shell">
      {error ? <div className="message-banner message-error">{error}</div> : null}
      {payload ? (
        <>
          <Card className="detail-card">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Coordinator profile</p>
                <h1>{payload.profile.fullName}</h1>
              </div>
            </div>
            <dl className="detail-grid">
              <div><dt>Email</dt><dd>{payload.profile.email}</dd></div>
              <div><dt>Institute</dt><dd>{payload.profile.institute}</dd></div>
              <div><dt>Department</dt><dd>{payload.profile.department}</dd></div>
              <div><dt>Location</dt><dd>{payload.profile.location}</dd></div>
              <div><dt>State</dt><dd>{payload.profile.state}</dd></div>
              <div><dt>Phone</dt><dd>{payload.profile.phoneNumber}</dd></div>
            </dl>
          </Card>

          <Card>
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Related workshops</p>
                <h2>Workshop history</h2>
              </div>
            </div>
            <div className="list-stack">
              {payload.workshops?.map((workshop) => (
                <article key={workshop.id} className="record-card">
                  <div>
                    <h3>{workshop.workshopType.name}</h3>
                    <p>{workshop.date}</p>
                  </div>
                  <div className="card-actions">
                    <StatusBadge status={workshop.statusLabel} />
                    <Link className="text-link" to={`/workshops/${workshop.id}`}>Details</Link>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
