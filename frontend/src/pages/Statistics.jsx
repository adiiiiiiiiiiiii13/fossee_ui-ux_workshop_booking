import React from 'react';
import Card from '../components/ui/Card';

const Statistics = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Workshop Statistics</h1>
      <Card>
        <p style={{ color: 'var(--text-secondary)' }}>Global statistics charts and data will go here.</p>
      </Card>
    </div>
  );
};

export default Statistics;
