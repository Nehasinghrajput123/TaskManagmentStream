import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { useDispatch } from 'react-redux';
import { patchTaskPosition, optimisticMoveTask } from '../../store/taskSlice';

const KanbanBoard = ({ tasks = [], onTaskClick, onAddTask }) => {
  const dispatch = useDispatch();

  const columns = {
    todo: {
      id: 'todo',
      title: 'To Do',
      color: '#cbd5e1',
      tasks: tasks.filter((t) => t.status === 'todo'),
    },
    in_progress: {
      id: 'in_progress',
      title: 'In Progress',
      color: '#818cf8',
      tasks: tasks.filter((t) => t.status === 'in_progress'),
    },
    done: {
      id: 'done',
      title: 'Done',
      color: '#34d399',
      tasks: tasks.filter((t) => t.status === 'done'),
    },
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const newPosition = destination.index;

    // Optimistically update UI
    dispatch(
      optimisticMoveTask({
        taskId,
        destinationStatus: newStatus,
        newPosition,
      })
    );

    // Sync with backend API
    dispatch(
      patchTaskPosition({
        id: taskId,
        status: newStatus,
        position: newPosition,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board-container">
        {Object.values(columns).map((col) => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            title={col.title}
            tasks={col.tasks}
            statusColor={col.color}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
