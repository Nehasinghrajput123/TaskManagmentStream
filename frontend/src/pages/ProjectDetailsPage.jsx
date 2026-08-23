import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskModal from '../components/tasks/TaskModal';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import MemberModal from '../components/projects/MemberModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, addProjectMember, removeProjectMember } from '../store/projectSlice';
import { fetchBoardsByProject, createBoard } from '../store/boardSlice';
import { fetchTasks, createTask, updateTask } from '../store/taskSlice';
import { Plus, Search, Filter, Users, ArrowLeft, Layers } from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';

const ProjectDetailsPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const { currentProject, loading: projectLoading } = useSelector((state) => state.projects);
  const { boards } = useSelector((state) => state.boards);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchBoardsByProject(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoardId]);

  useEffect(() => {
    if (projectId) {
      dispatch(
        fetchTasks({
          projectId,
          boardId: selectedBoardId || undefined,
          priority: priorityFilter || undefined,
          assignedTo: assignedFilter || undefined,
          search: search || undefined,
        })
      );
    }
  }, [projectId, selectedBoardId, priorityFilter, assignedFilter, search, dispatch]);

  const handleCreateOrUpdateTask = async (taskData) => {
    if (selectedTask && isTaskModalOpen && !isDetailModalOpen) {
      const result = await dispatch(updateTask({ id: selectedTask._id, data: taskData }));
      if (updateTask.fulfilled.match(result)) {
        showSuccess('Task updated successfully!');
        setIsTaskModalOpen(false);
        setSelectedTask(null);
      } else {
        showError(result.payload || 'Failed to update task');
      }
    } else {
      const result = await dispatch(createTask(taskData));
      if (createTask.fulfilled.match(result)) {
        showSuccess('Task created successfully!');
        setIsTaskModalOpen(false);
      } else {
        showError(result.payload || 'Failed to create task');
      }
    }
  };

  const handleAddMember = async (pId, uId) => {
    const result = await dispatch(addProjectMember({ projectId: pId, userId: uId }));
    if (addProjectMember.fulfilled.match(result)) {
      showSuccess('Member added');
    } else {
      showError(result.payload || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (pId, uId) => {
    const result = await dispatch(removeProjectMember({ projectId: pId, userId: uId }));
    if (removeProjectMember.fulfilled.match(result)) {
      showSuccess('Member removed');
    } else {
      showError(result.payload || 'Failed to remove member');
    }
  };

  const canManage =
    user?.role === 'admin' ||
    user?.role === 'manager' ||
    currentProject?.owner?._id === user?._id ||
    currentProject?.owner === user?._id;

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title={currentProject?.name || 'Project Details'} />

        <div className="page-body">
          {/* Top Project Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <button onClick={() => navigate('/projects')} className="btn btn-outline btn-sm">
              <ArrowLeft size={16} /> Back to Projects
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <StatusBadge status={currentProject?.status} />
             {canManage && (
  <button
    onClick={() => setIsMemberModalOpen(true)}
    className="btn btn-outline btn-sm"
  >
    <Users size={16} /> Invite User ({currentProject?.members?.length || 0})
  </button>
)}
            </div>
          </div>

          {/* Project Details Box */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#0f172a' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>{currentProject?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {currentProject?.description || 'No project description provided.'}
            </p>
          </div>

          {/* Task Filters & Control Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              background: '#1e293b',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: 200 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem' }}
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} />
              </div>

              {/* Board Selector */}
              {boards.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={16} className="text-indigo-400" />
                  <select
                    className="form-select"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                  >
                    {boards.map((b) => (
                      <option key={b._id} value={b._id}>
                        Board: {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Priority Filter */}
              <select
                className="form-select"
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', width: 140 }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Assignee Filter */}
              <select
                className="form-select"
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', width: 150 }}
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
              >
                <option value="">All Assignees</option>
                {currentProject?.members?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

         {canManage && (
  <button 
    onClick={() => { 
      setSelectedTask(null); 
      setDefaultTaskStatus('todo'); 
      setIsTaskModalOpen(true); 
    }} 
    className="btn btn-primary btn-sm" 
  >
    <Plus size={16} /> Add Task 
  </button>
)}
          </div>

          {/* Kanban Board View */}
          <KanbanBoard
            tasks={tasks}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setIsDetailModalOpen(true);
            }}
            onAddTask={(columnId) => {
              setSelectedTask(null);
              setDefaultTaskStatus(columnId);
              setIsTaskModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        projects={[currentProject]}
        boards={boards}
        members={currentProject?.members || []}
        initialData={selectedTask}
        defaultStatus={defaultTaskStatus}
        defaultProjectId={projectId}
        loading={tasksLoading}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        members={currentProject?.members || []}
        currentUser={user}
        onEditTask={(t) => {
          setIsDetailModalOpen(false);
          setSelectedTask(t);
          setIsTaskModalOpen(true);
        }}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        project={currentProject}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
};

export default ProjectDetailsPage;
