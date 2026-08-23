const Board = require('../models/Board');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const ApiError = require('../utils/apiError');
const projectService = require('./projectService');

class BoardService {
  async createBoard(projectId, data, user) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    projectService.checkProjectAccess(project, user._id, user.role);

    const board = new Board({
      project: projectId,
      name: data.name,
      description: data.description || '',
      position: data.position !== undefined ? data.position : 0,
    });

    await board.save();
    return board;
  }

  async getBoardsByProject(projectId, user) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    projectService.checkProjectAccess(project, user._id, user.role);

    const boards = await Board.find({ project: projectId }).sort({ position: 1, createdAt: 1 });
    return boards;
  }

  async getBoardById(boardId, user) {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new ApiError(404, 'Board not found');
    }

    const project = await Project.findById(board.project);
    if (project) {
      projectService.checkProjectAccess(project, user._id, user.role);
    }

    return board;
  }

  async updateBoard(boardId, updateData, user) {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new ApiError(404, 'Board not found');
    }

    const project = await Project.findById(board.project);
    if (project) {
      projectService.checkProjectAccess(project, user._id, user.role);
    }

    if (updateData.name !== undefined) board.name = updateData.name;
    if (updateData.description !== undefined) board.description = updateData.description;
    if (updateData.position !== undefined) board.position = updateData.position;

    await board.save();
    return board;
  }

  async deleteBoard(boardId, user) {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new ApiError(404, 'Board not found');
    }

    const project = await Project.findById(board.project);
    if (project) {
      projectService.checkProjectManagementRights(project, user._id, user.role);
    }

    const tasks = await Task.find({ board: boardId }).select('_id');
    const taskIds = tasks.map((t) => t._id);

    await Comment.deleteMany({ task: { $in: taskIds } });
    await Activity.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ board: boardId });
    await Board.findByIdAndDelete(boardId);

    return true;
  }
}

module.exports = new BoardService();
