import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ columnId, title, tasks = [], onTaskClick, onAddTask, statusColor }) => {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColor || '#6366f1' }} />
          <h3 style={{ fontSize: '1rem', textTransform: 'capitalize' }}>{title}</h3>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              background: '#1e293b',
              padding: '2px 8px',
              borderRadius: 999,
              color: 'var(--text-secondary)',
            }}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(columnId)}
          className="btn btn-outline btn-sm"
          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
          title="Add task to column"
        >
          <Plus size={16} />
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
            style={{
              backgroundColor: snapshot.isDraggingOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onClick={onTaskClick} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                No tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
