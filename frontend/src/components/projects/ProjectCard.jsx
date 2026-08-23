import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/Badge';
import { Users, Calendar, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onManageMembers,
  canManage
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
      }}
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}
        >
          <h3 style={{ fontSize: '1.15rem' }}>{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.85rem',
            marginTop: '0.5rem'
          }}
        >
        
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {canManage && (
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageMembers(project);
                }}
                title="Manage Members"
              >
                <Users size={14} />
              </button>
            )}

            {/* Edit Project */}
            {canManage && (
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                title="Edit Project"
              >
                <Pencil size={14} />
              </button>
            )}

            {/* Delete Project */}
            {canManage && (
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
                title="Delete Project"
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              Open Board <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem'
          }}
        >
          <Calendar size={12} />
          <span>Updated {formatDate(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;