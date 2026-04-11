import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { acceptWorkshop, getStatus, rescheduleWorkshop } from '../services/workshopService';

export default function StatusPage() {
  const { user } = useAuth();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateDrafts, setDateDrafts] = useState({});

  const loadStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStatus();
      setPayload(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load your workshop status.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptWorkshop(id);
      await loadStatus();
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop could not be accepted.'));
    }
  };

  const handleReschedule = async (id) => {
    if (!dateDrafts[id]) {
      return;
    }
    try {
      await rescheduleWorkshop(id, dateDrafts[id]);
      await loadStatus();
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop date could not be updated.'));
    }
  };

  if (loading && !payload) {
    return <LoadingState label="Loading your workshops..." />;
  }

  const isInstructor = user?.isInstructor;

  return (
    <div className="page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">{isInstructor ? 'Instructor workspace' : 'Coordinator workspace'}</p>
          <h1>{isInstructor ? 'Workshop dashboard' : 'My workshop status'}</h1>
          <p className="muted-text">
            {isInstructor
              ? 'Review incoming proposals, accept requests, and reschedule confirmed workshops.'
              : 'Track pending proposals, view accepted workshops, and jump into workshop details.'}
          </p>
        </div>
      </section>

      {error ? <div className="message-banner message-error">{error}</div> : null}

      <div className="content-stack">
        <Card>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Confirmed</p>
              <h2>{isInstructor ? 'Accepted workshops' : 'Workshops accepted for you'}</h2>
            </div>
          </div>
          {payload?.accepted?.length ? (
            <div className="list-stack">
              {payload.accepted.map((workshop) => (
                <article className="record-card" key={workshop.id}>
                  <div>
                    <h3>{workshop.workshopType.name}</h3>
                    <p>{isInstructor ? workshop.coordinator.name : workshop.instructor?.name || 'Instructor pending'}</p>
                  </div>
                  <div className="card-actions">
                    <StatusBadge status={workshop.statusLabel} />
                    <Link className="text-link" to={`/workshops/${workshop.id}`}>Details</Link>
                  </div>
                  <dl className="record-grid">
                    <div><dt>Date</dt><dd>{workshop.date}</dd></div>
                    <div><dt>Institute</dt><dd>{workshop.coordinator.institute}</dd></div>
                    {isInstructor ? (
                      <div><dt>Coordinator</dt><dd>{workshop.coordinator.name}</dd></div>
                    ) : (
                      <div><dt>Instructor</dt><dd>{workshop.instructor?.name || 'Not assigned'}</dd></div>
                    )}
                  </dl>
                  {isInstructor ? (
                    <div className="inline-form">
                      <input
                        type="date"
                        value={dateDrafts[workshop.id] || ''}
                        onChange={(event) => setDateDrafts((current) => ({ ...current, [workshop.id]: event.target.value }))}
                        className="mini-date"
                      />
                      <Button variant="outline" onClick={() => handleReschedule(workshop.id)}>
                        Save new date
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No accepted workshops yet"
              description={isInstructor ? 'Accepted workshops will show up here once you approve proposals.' : 'Accepted workshops will appear here after an instructor confirms them.'}
            />
          )}
        </Card>

        <Card>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Pending</p>
              <h2>{isInstructor ? 'Incoming proposals' : 'Proposals awaiting confirmation'}</h2>
            </div>
            {!isInstructor ? <Link className="text-link" to="/propose">Propose another workshop</Link> : null}
          </div>
          {payload?.pending?.length ? (
            <div className="list-stack">
              {payload.pending.map((workshop) => (
                <article className="record-card" key={workshop.id}>
                  <div>
                    <h3>{workshop.workshopType.name}</h3>
                    <p>{workshop.coordinator.name} at {workshop.coordinator.institute}</p>
                  </div>
                  <div className="card-actions">
                    <StatusBadge status={workshop.statusLabel} />
                    <Link className="text-link" to={`/workshops/${workshop.id}`}>Details</Link>
                  </div>
                  <dl className="record-grid">
                    <div><dt>Date</dt><dd>{workshop.date}</dd></div>
                    <div><dt>State</dt><dd>{workshop.coordinator.state}</dd></div>
                    <div><dt>Coordinator</dt><dd>{workshop.coordinator.name}</dd></div>
                  </dl>
                  {isInstructor ? (
                    <div className="inline-actions">
                      <Link className="text-link" to={`/profile/${workshop.coordinator.id}`}>View coordinator</Link>
                      <Button onClick={() => handleAccept(workshop.id)}>Accept workshop</Button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No pending proposals right now"
              description={isInstructor ? 'New coordinator requests will land here.' : 'Submit a new proposal when you are ready.'}
              action={!isInstructor ? <Link className="button-link button-link-primary" to="/propose">Propose workshop</Link> : null}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
