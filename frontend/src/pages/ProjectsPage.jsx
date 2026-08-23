import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import MemberModal from '../components/projects/MemberModal';
import { CardSkeleton } from '../components/common/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  createProject,
  updateProject,
  addProjectMember,
  removeProjectMember,
  deleteProject
} from '../store/projectSlice';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const ProjectsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const {
    projects,
    loading,
  } = useSelector((state) => state.projects);

  const { user } = useSelector((state) => state.auth);

  const canCreate =
    user?.role === 'admin' ||
    user?.role === 'manager';

  useEffect(() => {
    dispatch(
      fetchProjects({
        search,
        status: statusFilter,
      })
    );
  }, [dispatch, search, statusFilter]);

  const handleCreateOrUpdateProject = async (formData) => {
    if (selectedProject) {
      const result = await dispatch(
        updateProject({
          id: selectedProject._id,
          data: formData,
        })
      );

      if (updateProject.fulfilled.match(result)) {
        showSuccess('Project updated successfully');
        setIsProjectModalOpen(false);
        setSelectedProject(null);
      } else {
        showError(
          result.payload || 'Failed to update project'
        );
      }
    } else {
      const result = await dispatch(
        createProject(formData)
      );

      if (createProject.fulfilled.match(result)) {
        showSuccess('Project created successfully');
        setIsProjectModalOpen(false);
      } else {
        showError(
          result.payload || 'Failed to create project'
        );
      }
    }
  };

  const handleDeleteProject = async (project) => {
  const result = await dispatch(deleteProject(project._id));

  if (deleteProject.fulfilled.match(result)) {
    showSuccess('Project deleted successfully');
  } else {
    showError(
      result.payload || 'Failed to delete project'
    );
  }
};
  const handleAddMember = async (projectId, userId) => {
    const result = await dispatch(
      addProjectMember({
        projectId,
        userId,
      })
    );

    if (addProjectMember.fulfilled.match(result)) {
      showSuccess('Member added');
      setSelectedProject(result.payload);
    } else {
      showError(
        result.payload || 'Failed to add member'
      );
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    const result = await dispatch(
      removeProjectMember({
        projectId,
        userId,
      })
    );

    if (removeProjectMember.fulfilled.match(result)) {
      showSuccess('Member removed');
      setSelectedProject(result.payload);
    } else {
      showError(
        result.payload || 'Failed to remove member'
      );
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header title="Projects" />

        <div className="page-body">

          {/* Top section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                }}
              >
                Your Projects
              </h2>

              <p
                style={{
                  margin: '0.3rem 0 0',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                }}
              >
                Manage your projects and team members.
              </p>
            </div>

            {canCreate && (
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Plus size={17} />
                New Project
              </button>
            )}
          </div>

          {/* Search and filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                minWidth: 240,
              }}
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  color: 'var(--text-muted)',
                }}
              />

              <input
                type="text"
                className="form-input"
                placeholder="Search projects..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  paddingLeft: '2.2rem',
                }}
              />
            </div>

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                width: 150,
              }}
            >
              <option value="">All projects</option>
              <option value="active">Active</option>
              <option value="completed">
                Completed
              </option>
              <option value="archived">
                Archived
              </option>
            </select>
          </div>

          {/* Projects */}
          {loading && projects.length === 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[1, 2, 3].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          ) : 
          projects.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3.5rem 2rem',
              }}
            >
              <FolderKanban
                size={42}
                style={{
                  margin: '0 auto 0.9rem',
                  opacity: 0.45,
                }}
              />

              <h3
                style={{
                  margin: '0 0 0.4rem',
                  fontSize: '1.05rem',
                }}
              >
                No projects found
              </h3>

              <p
                style={{
                  margin: '0 auto 1.25rem',
                  maxWidth: 360,
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                }}
              >
                {search || statusFilter
                  ? 'Try changing your search or filter.'
                  : 'There are no projects to show yet.'}
              </p>

              {canCreate && !search && !statusFilter && (
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={17} />
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {projects.map((project) => {
                const isOwner =
                  project.owner?._id === user?._id ||
                  project.owner === user?._id;

                const canManage =
                  user?.role === 'admin' ||
                  user?.role === 'manager' ||
                  isOwner;

                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    canManage={canManage}
                    onEdit={(project) => {
                      setSelectedProject(project);
                      setIsProjectModalOpen(true);
                    }}
                    onManageMembers={(project) => {
                      setSelectedProject(project);
                      setIsMemberModalOpen(true);
                    }}
                      onDelete={handleDeleteProject}

                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Project modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() =>
          setIsProjectModalOpen(false)
        }
        onSubmit={handleCreateOrUpdateProject}
        initialData={selectedProject}
        loading={loading}
      />

      {/* Members modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() =>
          setIsMemberModalOpen(false)
        }
        project={selectedProject}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        loading={loading}
      />
    </div>
  );
};

export default ProjectsPage;