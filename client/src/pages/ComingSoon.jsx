import React from 'react';

const ComingSoon = ({ title }) => {
  return (
    <div className="page" style={{ paddingTop: '100px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>This section of Luxe Noir is currently being curated. Please check back later.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
