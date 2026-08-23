import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, Sparkles } from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h1 className="header-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="header-user-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: 999, border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Sparkles size={14} className="text-indigo-400" style={{ color: '#818cf8' }} />
          <span>Role: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{user?.role}</strong></span>
        </div>

        <button
          className="btn btn-outline"
          style={{ width: 40, height: 40, padding: 0, borderRadius: '50%' }}
          title="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
