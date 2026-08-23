export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'badge-urgent';
    case 'high':
      return 'badge-high';
    case 'medium':
      return 'badge-medium';
    case 'low':
    default:
      return 'badge-low';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'done':
    case 'completed':
      return 'badge-done';
    case 'in_progress':
      return 'badge-in_progress';
    case 'todo':
    case 'active':
    default:
      return 'badge-todo';
  }
};
