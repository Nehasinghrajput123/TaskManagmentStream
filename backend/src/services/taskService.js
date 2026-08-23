const Task = require('../models/Task');
const Project = require('../models/Project');
const Board = require('../models/Board');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const projectService = require('./projectService');
const activityService = require('./activityService');

class TaskService {
  async createTask(data, currentUser) {
    const project = await Project.findById(data.project);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    projectService.checkProjectAccess(project, currentUser._id, currentUser.role);

    const board = await Board.findById(data.board);
    if (!board || board.project.toString() !== data.project.toString()) {
      throw new ApiError(400, 'Invalid board for this project');
    }

    const taskCount = await Task.countDocuments({ board: data.board });

    const task = new Task({
      project: data.project,
      board: data.board,
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedTo: data.assignedTo || null,
      createdBy: currentUser._id,
      position: data.position !== undefined ? data.position : taskCount,
    });

    await task.save();

    await activityService.createActivity({
      task: task._id,
      user: currentUser._id,
      action: 'Task created',
      newValue: task.title,
    });

    return await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('board', 'name position');
  }

  async getAllTasks(currentUser, query = {}) {
    const {
      projectId,
      boardId,
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 20,
    } = query;

    const filter = {};

    // Filter by project access
    if (currentUser.role !== 'admin') {
      const userProjects = await Project.find({
        $or: [{ owner: currentUser._id }, { members: currentUser._id }],
      }).select('_id');
      const userProjectIds = userProjects.map((p) => p._id);
      filter.project = { $in: userProjectIds };
    }

    if (projectId) {
      filter.project = projectId;
    }

    if (boardId) {
      filter.board = boardId;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('board', 'name position')
      .sort({ position: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    return {
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async getTaskById(taskId, currentUser) {
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('board', 'name position')
      .populate('project', 'name owner members');

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    return task;
  }

  async updateTask(taskId, updateData, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    const activityPromises = [];

    if (updateData.title && updateData.title !== task.title) {
      activityPromises.push(
        activityService.createActivity({
          task: taskId,
          user: currentUser._id,
          action: 'Task updated',
          oldValue: task.title,
          newValue: updateData.title,
        })
      );
      task.title = updateData.title;
    }

    if (updateData.description !== undefined && updateData.description !== task.description) {
      task.description = updateData.description;
    }

    if (updateData.status && updateData.status !== task.status) {
      activityPromises.push(
        activityService.createActivity({
          task: taskId,
          user: currentUser._id,
          action: 'Status changed',
          oldValue: task.status,
          newValue: updateData.status,
        })
      );
      task.status = updateData.status;
    }

    if (updateData.priority && updateData.priority !== task.priority) {
      activityPromises.push(
        activityService.createActivity({
          task: taskId,
          user: currentUser._id,
          action: 'Priority changed',
          oldValue: task.priority,
          newValue: updateData.priority,
        })
      );
      task.priority = updateData.priority;
    }

    if (updateData.dueDate !== undefined) {
      const newDueDate = updateData.dueDate ? new Date(updateData.dueDate).toISOString() : '';
      const oldDueDate = task.dueDate ? new Date(task.dueDate).toISOString() : '';
      if (newDueDate !== oldDueDate) {
        activityPromises.push(
          activityService.createActivity({
            task: taskId,
            user: currentUser._id,
            action: 'Due date changed',
            oldValue: oldDueDate ? oldDueDate.substring(0, 10) : 'None',
            newValue: newDueDate ? newDueDate.substring(0, 10) : 'None',
          })
        );
        task.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
      }
    }

    if (updateData.assignedTo !== undefined) {
      const newAssignee = updateData.assignedTo ? updateData.assignedTo.toString() : null;
      const oldAssignee = task.assignedTo ? task.assignedTo.toString() : null;
      if (newAssignee !== oldAssignee) {
        let assigneeName = 'Unassigned';
        if (newAssignee) {
          const user = await User.findById(newAssignee);
          if (user) assigneeName = user.name;
        }
        activityPromises.push(
          activityService.createActivity({
            task: taskId,
            user: currentUser._id,
            action: 'Task assigned',
            oldValue: oldAssignee || 'Unassigned',
            newValue: assigneeName,
          })
        );
        task.assignedTo = newAssignee;
      }
    }

    if (updateData.board && updateData.board.toString() !== task.board.toString()) {
      task.board = updateData.board;
    }

    if (updateData.position !== undefined) {
      task.position = updateData.position;
    }

    await task.save();
    await Promise.all(activityPromises);

    return await Task.findById(taskId)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('board', 'name position');
  }

  async patchStatus(taskId, status, currentUser) {
    return this.updateTask(taskId, { status }, currentUser);
  }

  async patchAssign(taskId, assignedTo, currentUser) {
    return this.updateTask(taskId, { assignedTo }, currentUser);
  }

  async patchPosition(taskId, { board, position, status }, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const updates = {};
    if (position !== undefined) updates.position = position;
    if (status && status !== task.status) updates.status = status;
    if (board && board.toString() !== task.board.toString()) updates.board = board;

    if (status && status !== task.status) {
      await activityService.createActivity({
        task: taskId,
        user: currentUser._id,
        action: 'Task moved',
        oldValue: task.status,
        newValue: status,
      });
    }

    return this.updateTask(taskId, updates, currentUser);
  }

  async deleteTask(taskId, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    await Comment.deleteMany({ task: taskId });
    await Activity.deleteMany({ task: taskId });
    await Task.findByIdAndDelete(taskId);

    return true;
  }

  async getDashboardStats(currentUser) {
    const projectFilter = {};
    if (currentUser.role !== 'admin') {
      projectFilter.$or = [
        { owner: currentUser._id },
        { members: currentUser._id },
      ];
    }

    const projects = await Project.find(projectFilter).select('_id status');
    const projectIds = projects.map((p) => p._id);

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'active').length;

    const taskFilter = { project: { $in: projectIds } };

    const totalTasks = await Task.countDocuments(taskFilter);
    const todoTasks = await Task.countDocuments({ ...taskFilter, status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: 'in_progress' });
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'done' });

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'done' },
      dueDate: { $lt: now },
    });

    const recentActivities = await Activity.find({
      task: { $in: await Task.find(taskFilter).select('_id') },
    })
      .populate('user', 'name email avatar')
      .populate({
        path: 'task',
        select: 'title project',
        populate: { path: 'project', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      recentActivities,
    };
  }
}

module.exports = new TaskService();
