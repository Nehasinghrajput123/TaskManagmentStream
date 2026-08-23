import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  boards = [],
  members = [],
  initialData = null,
  defaultStatus = 'todo',
  defaultProjectId = '',
  loading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [boardId, setBoardId] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setProjectId(initialData.project?._id || initialData.project || defaultProjectId);
      setBoardId(initialData.board?._id || initialData.board || '');
      setStatus(initialData.status || 'todo');
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().substring(0, 10) : '');
      setAssignedTo(initialData.assignedTo?._id || initialData.assignedTo || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId);
      setBoardId(boards[0]?._id || '');
      setStatus(defaultStatus);
      setPriority('medium');
      setDueDate('');
      setAssignedTo('');
    }
  }, [initialData, isOpen, defaultProjectId, defaultStatus, boards]);

  useEffect(() => {
    if (boards.length > 0 && !boardId) {
      setBoardId(boards[0]._id);
    }
  }, [boards, boardId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId || !boardId) return;

    onSubmit({
      title,
      description,
      project: projectId,
      board: boardId,
      status,
      priority,
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Implement user login form"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Provide context and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Board *</label>
            <select
              className="form-select"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              required
            >
              {boards.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Assignee</label>
          <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">-- Unassigned --</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !title.trim() || !boardId}>
            {loading ? 'Saving...' : initialData ? 'Save Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
