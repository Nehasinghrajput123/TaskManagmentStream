import React from 'react';
import { History } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <History size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
        <p>No activity recorded for this task yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 300, overflowY: 'auto' }}>
      {activities.map((act) => (
        <div
          key={act._id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.6rem 0.85rem',
            background: '#0f172a',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
          }}
        >
          <img
            src={act.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name}`}
            alt={act.user?.name}
            className="avatar"
            style={{ width: 26, height: 26 }}
          />
          <div style={{ flex: 1 }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>{act.user?.name}</strong>{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>
            </div>
            {(act.oldValue || act.newValue) && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {act.oldValue && <span>From "{act.oldValue}" </span>}
                {act.newValue && <span>To "{act.newValue}"</span>}
              </div>
            )}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {formatRelativeTime(act.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
