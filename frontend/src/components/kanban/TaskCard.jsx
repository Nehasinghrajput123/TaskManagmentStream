import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PriorityBadge } from '../common/Badge';
import { Clock, MessageSquare } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const TaskCard = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging ? 'var(--shadow-glow)' : 'var(--shadow-md)',
            borderColor: snapshot.isDragging ? 'var(--primary)' : 'var(--border-color)',
          }}
          onClick={() => onClick(task)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <PriorityBadge priority={task.priority} />
            {task.board?.name && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{task.board.name}</span>
            )}
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.65rem', lineHeight: 1.3 }}>
            {task.title}
          </h4>

          {task.description && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.commentsCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MessageSquare size={12} />
                  <span>{task.commentsCount}</span>
                </div>
              )}
            </div>

            {task.assignedTo ? (
              <img
                src={task.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo.name}`}
                alt={task.assignedTo.name}
                title={`Assigned to ${task.assignedTo.name}`}
                className="avatar"
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
