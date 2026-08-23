const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiError = require('../utils/apiError');
const projectService = require('./projectService');
const activityService = require('./activityService');

class CommentService {
  async createComment(taskId, content, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    const comment = new Comment({
      task: taskId,
      user: currentUser._id,
      content,
    });

    await comment.save();

    await activityService.createActivity({
      task: taskId,
      user: currentUser._id,
      action: 'Comment added',
      newValue: content.length > 50 ? `${content.substring(0, 50)}...` : content,
    });

    return await Comment.findById(comment._id).populate('user', 'name email avatar role');
  }

  async getCommentsByTask(taskId, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    const comments = await Comment.find({ task: taskId })
      .populate('user', 'name email avatar role')
      .sort({ createdAt: 1 });

    return comments;
  }

  async updateComment(commentId, content, currentUser) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    if (
      comment.user.toString() !== currentUser._id.toString() &&
      currentUser.role !== 'admin'
    ) {
      throw new ApiError(403, 'Permission denied. You can only update your own comments.');
    }

    comment.content = content;
    await comment.save();

    return await Comment.findById(commentId).populate('user', 'name email avatar role');
  }

  async deleteComment(commentId, currentUser) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    if (
      comment.user.toString() !== currentUser._id.toString() &&
      currentUser.role !== 'admin'
    ) {
      throw new ApiError(403, 'Permission denied. You can only delete your own comments.');
    }

    await Comment.findByIdAndDelete(commentId);
    return true;
  }
}

module.exports = new CommentService();
