import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px' }}>
          FOSSEE Workshops
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          A minimal, fast, and modern interface for managing workshop bookings and tracking completion statistics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <Card>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Sign in to manage your workshop proposals and check real-time attendance stats.
          </p>
          <div>
            <Button fullWidth onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Browse Available</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            You don't need to be authenticated to view current public workshops and general statistics.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <Button variant="outline" onClick={() => navigate('/types')}>View All Workshops</Button>
             <Button variant="outline" onClick={() => navigate('/statistics')}>Global Statistics</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
