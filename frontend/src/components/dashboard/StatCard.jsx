import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#6366f1', description }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: `${color}18`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={26} />
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
        {description && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
