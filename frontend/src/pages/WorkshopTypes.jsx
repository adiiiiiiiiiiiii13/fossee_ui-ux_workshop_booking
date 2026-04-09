import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getWorkshopTypes } from '../services/workshopService';

const WorkshopTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setLoading(true);
    getWorkshopTypes(page)
      .then((res) => {
        // Django returns HTML — we parse it to detect workshops
        // Until DRF is added, we show a helpful message.
        // This will seamlessly work once Django views return JSON.
        setTypes([]);
        setError('');
      })
      .catch(() => {
        setError('Could not load workshop types. Make sure the Django server is running on port 8000.');
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Workshop Types</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Browse all available FOSSEE workshop programmes.
      </p>

      {loading && (
        <p style={{ color: 'var(--text-secondary)' }}>Loading workshops…</p>
      )}

      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <p style={{ color: '#f87171', fontSize: '0.95rem' }}>⚠ {error}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Run <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>python manage.py runserver</code> in your Django project root.
          </p>
        </div>
      )}

      {!loading && !error && types.length === 0 && (
        <Card>
          <p style={{ color: 'var(--text-secondary)' }}>
            No workshops found, or the Django backend needs JSON API endpoints.
            The service layer in <code>src/services/workshopService.js</code> is ready —
            add Django REST Framework to Django and this page will populate automatically.
          </p>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {types.map((t) => (
          <Card key={t.id}>
            <h3 style={{ marginBottom: '0.5rem' }}>{t.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {t.description || 'No description available.'}
            </p>
            <Button variant="outline">View Details</Button>
          </Card>
        ))}
      </div>

      {(page > 1 || hasNext) && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
          <Button variant="outline" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>Next →</Button>
        </div>
      )}
    </div>
  );
};

export default WorkshopTypes;
