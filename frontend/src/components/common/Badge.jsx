import React from 'react';
import { getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

export const PriorityBadge = ({ priority }) => {
  const badgeClass = getPriorityBadgeClass(priority);
  return <span className={`badge ${badgeClass}`}>{priority || 'low'}</span>;
};

export const StatusBadge = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status);
  const displayStatus = (status || 'todo').replace('_', ' ');
  return <span className={`badge ${badgeClass}`}>{displayStatus}</span>;
};
