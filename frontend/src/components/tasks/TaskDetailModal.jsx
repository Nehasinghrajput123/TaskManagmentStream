import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CommentSection from './CommentSection';
import ActivityTimeline from './ActivityTimeline';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { Clock, User, Calendar, MessageSquare, History, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTaskComments,
  addComment,
  deleteComment,
  fetchTaskActivities,
  patchTaskStatus,
  patchTaskAssign,
  deleteTask,
} from '../../store/taskSlice';

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onEditTask,
  members = [],
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState('comments');
  const dispatch = useDispatch();
  const { comments, activities } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (task && isOpen) {
      dispatch(fetchTaskComments(task._id));
      dispatch(fetchTaskActivities(task._id));
    }
  }, [task, isOpen, dispatch]);

  if (!task) return null;

  const handleStatusChange = (newStatus) => {
    dispatch(patchTaskStatus({ id: task._id, status: newStatus }));
  };

  const handleAssignChange = (newAssignee) => {
    dispatch(patchTaskAssign({ id: task._id, assignedTo: newAssignee }));
  };

  const handleAddComment = (content) => {
    dispatch(addComment({ taskId: task._id, content }));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id));
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} maxWidth="750px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Badges & Actions bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#0f172a', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => onEditTask(task)}>
              <Edit3 size={14} /> Edit
            </button>
            <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={handleDeleteTask}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Task Metadata & Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Description
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
              <select
                className="form-select"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Assigned To</label>
              <select
                className="form-select"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
                value={task.assignedTo?._id || ''}
                onChange={(e) => handleAssignChange(e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Calendar size={14} className="text-indigo-400" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Comments / Activity) */}
        <div>
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('comments')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 0.25rem',
                borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : 'none',
                color: activeTab === 'comments' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MessageSquare size={16} /> Comments ({comments.length})
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 0.25rem',
                borderBottom: activeTab === 'activity' ? '2px solid var(--primary)' : 'none',
                color: activeTab === 'activity' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <History size={16} /> Activity Log ({activities.length})
            </button>
          </div>

          {activeTab === 'comments' ? (
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUser={currentUser}
            />
          ) : (
            <ActivityTimeline activities={activities} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
