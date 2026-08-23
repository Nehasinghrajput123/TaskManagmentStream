import React from 'react';

export const CardSkeleton = () => (
  <div className="card" style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div className="skeleton" style={{ height: 24, width: '60%' }} />
    <div className="skeleton" style={{ height: 16, width: '90%' }} />
    <div className="skeleton" style={{ height: 16, width: '40%' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 28, width: 28, borderRadius: '50%' }} />
    </div>
  </div>
);

export const TaskSkeleton = () => (
  <div className="task-card" style={{ height: 100, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div className="skeleton" style={{ height: 18, width: '80%' }} />
    <div className="skeleton" style={{ height: 14, width: '50%' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
      <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 24, width: 24, borderRadius: '50%' }} />
    </div>
  </div>



);
