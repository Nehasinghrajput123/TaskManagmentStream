import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useSelector } from 'react-redux';
import { Shield, Mail, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title="Profile" />

        <div
          className="page-body"
          style={{
            maxWidth: 900,
          }}
        >
          {/* Profile Header */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                }
                alt={user?.name}
                className="avatar"
                style={{
                  width: 72,
                  height: 72,
                  border: '2px solid var(--border-color)',
                }}
              />

              <div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: '0.35rem',
                    fontSize: '1.35rem',
                  }}
                >
                  {user?.name}
                </h2>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                  }}
                >
                  <Mail size={15} />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                }}
              >
                Account information
              </h3>

              <p
                style={{
                  margin: '0.3rem 0 0',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                }}
              >
                Basic information associated with your account.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {/* Role */}
              <div
                style={{
                  padding: '1rem',
                  background: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  Role
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  <Shield size={16} />
                  {user?.role}
                </div>
              </div>

              {/* Joined */}
              <div
                style={{
                  padding: '1rem',
                  background: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  Joined
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <Calendar size={16} />
                  {formatDate(user?.createdAt || new Date())}
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  padding: '1rem',
                  background: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  Email
                </div>

                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    wordBreak: 'break-word',
                  }}
                >
                  {user?.email}
                </div>
              </div>

              {/* Account Status */}
              <div
                style={{
                  padding: '1rem',
                  background: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  Account
                </div>

                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;