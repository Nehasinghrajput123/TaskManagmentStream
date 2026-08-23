import React from 'react';
import { Clock, Activity as ActivityIcon } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
        <ActivityIcon size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
        <p>No recent activity records found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <Clock size={18} className="text-indigo-400" />
        <h3 style={{ fontSize: '1.1rem' }}>Recent Team Activity</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((act) => (
          <div key={act._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <img
              src={act.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name}`}
              alt={act.user?.name}
              className="avatar"
              style={{ width: 32, height: 32 }}
            />
            <div style={{ flex: 1, fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{act.user?.name || 'User'}</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>
                {act.task && (
                  <>
                    {' '}on <strong style={{ color: '#818cf8' }}>{act.task.title}</strong>
                  </>
                )}
              </div>
              {(act.oldValue || act.newValue) && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2, background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>
                  {act.oldValue && <span>From "{act.oldValue}" </span>}
                  {act.newValue && <span>To "{act.newValue}"</span>}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {formatRelativeTime(act.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
