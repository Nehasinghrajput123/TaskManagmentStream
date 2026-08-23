import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../api/axios';
import { UserPlus, UserMinus, Shield } from 'lucide-react';

const MemberModal = ({ isOpen, onClose, project, onAddMember, onRemoveMember, loading = false }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [fetchingUsers, setFetchingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, project]);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const res = await api.get('/users?limit=100');
      setAvailableUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const currentMemberIds = new Set(project?.members?.map((m) => m._id) || []);
  const nonMembers = availableUsers.filter((u) => !currentMemberIds.has(u._id));
console.log("edjehdehdej",nonMembers)
  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    onAddMember(project._id, selectedUserId);
    setSelectedUserId('');
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Members - ${project?.name || ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Add Member Form */}
        <form onSubmit={handleAdd} style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Add New Team Member</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="form-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={fetchingUsers || nonMembers.length === 0}
            >
              <option value="">-- Select user to add --</option>
              {nonMembers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email}) - {u.role}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary" disabled={loading || !selectedUserId}>
              <UserPlus size={16} /> Add
            </button>
          </div>
          {nonMembers.length === 0 && !fetchingUsers && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
              All available registered users are already members of this project.
            </span>
          )}
        </form>

        {/* Current Members List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Current Members ({project?.members?.length || 0})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 260, overflowY: 'auto' }}>
            {project?.members?.map((member) => {
              const isOwner = project.owner?._id === member._id || project.owner === member._id;
              return (
                <div
                  key={member._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: '#1e293b',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      alt={member.name}
                      className="avatar"
                      style={{ width: 32, height: 32 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isOwner ? (
                      <span className="badge badge-urgent" style={{ fontSize: '0.7rem' }}>
                        <Shield size={10} /> Owner
                      </span>
                    ) : (
                      <button
                        onClick={() => onRemoveMember(project._id, member._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Remove from project"
                        disabled={loading}
                      >
                        <UserMinus size={14} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MemberModal;
