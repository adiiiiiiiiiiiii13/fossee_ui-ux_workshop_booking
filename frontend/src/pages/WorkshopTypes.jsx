import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { getWorkshopTypes } from '../services/workshopService';

export default function WorkshopTypes() {
  const { user } = useAuth();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWorkshopTypes(page);
      setPayload(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Workshop types could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  if (loading && !payload) {
    return <LoadingState label="Loading workshop types..." />;
  }

  return (
    <div className="page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Workshop types</h1>
          <p className="muted-text">Browse workshop formats, duration, and detail pages before proposing or accepting a booking.</p>
        </div>
        {user?.isInstructor ? (
          <Link className="button-link button-link-primary" to="/types/new">Add workshop type</Link>
        ) : null}
      </section>

      {error ? <div className="message-banner message-error">{error}</div> : null}

      {payload?.items?.length ? (
        <>
          <div className="feature-grid">
            {payload.items.map((item) => (
              <Card key={item.id} className="feature-card">
                <p className="eyebrow">Duration: {item.duration} day(s)</p>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <Link className="text-link" to={`/types/${item.id}`}>View details</Link>
              </Card>
            ))}
          </div>

          {payload.pagination.totalPages > 1 ? (
            <div className="pagination-row">
              <Button variant="outline" disabled={!payload.pagination.hasPrevious} onClick={() => loadPage(payload.pagination.page - 1)}>
                Previous
              </Button>
              <Button variant="outline" disabled={!payload.pagination.hasNext} onClick={() => loadPage(payload.pagination.page + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState title="No workshop types added yet" description="Once instructors add workshop formats, they will appear here." />
      )}
    </div>
  );
}
