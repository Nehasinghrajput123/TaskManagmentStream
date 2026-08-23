import React, { useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/taskSlice';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { dashboardStats, loading } = useSelector(
    (state) => state.tasks
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title="Dashboard" />

        <div className="page-body">

          {/* Welcome Section */}
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  marginBottom: '0.35rem',
                }}
              >
                Workspace
              </div>

              <h2
                style={{
                  fontSize: '1.45rem',
                  marginBottom: '0.4rem',
                }}
              >
                Welcome back, {firstName}
              </h2>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  margin: 0,
                }}
              >
                Here's a quick look at your current projects and tasks.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
              }}
            >
              <ShieldCheck size={16} />

              <span style={{ color: 'var(--text-secondary)' }}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Overview Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.9rem',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1rem',
                  marginBottom: '0.2rem',
                }}
              >
                Overview
              </h3>

              <p
                style={{
                  margin: 0,
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                }}
              >
                Current workspace activity
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
              }}
            >
              <ArrowUpRight size={14} />
              Live overview
            </div>
          </div>

          {/* Stats */}
          {loading && !dashboardStats ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <StatCard
                title="Projects"
                value={dashboardStats?.totalProjects || 0}
                icon={FolderKanban}
                color="#6366f1"
                description={`${dashboardStats?.activeProjects || 0} active`}
              />

              <StatCard
                title="Tasks"
                value={dashboardStats?.totalTasks || 0}
                icon={ListTodo}
                color="#3b82f6"
                description={`${dashboardStats?.todoTasks || 0} pending`}
              />

              <StatCard
                title="In Progress"
                value={dashboardStats?.inProgressTasks || 0}
                icon={Clock}
                color="#8b5cf6"
                description="Currently active"
              />

              <StatCard
                title="Completed"
                value={dashboardStats?.completedTasks || 0}
                icon={CheckCircle2}
                color="#10b981"
                description="Tasks completed"
              />

              <StatCard
                title="Overdue"
                value={dashboardStats?.overdueTasks || 0}
                icon={AlertTriangle}
                color="#ef4444"
                description="Needs attention"
              />
            </div>
          )}

          {/* Recent Activity */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1rem',
                    marginBottom: '0.2rem',
                  }}
                >
                  Recent Activity
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                  }}
                >
                  Latest updates from your workspace
                </p>
              </div>
            </div>

            <RecentActivity
              activities={dashboardStats?.recentActivities}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;