const Activity = require('../models/Activity');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiError = require('../utils/apiError');
const projectService = require('./projectService');

class ActivityService {
  async createActivity({ task, user, action, oldValue = '', newValue = '', metadata = {} }) {
    const activity = new Activity({
      task,
      user,
      action,
      oldValue: String(oldValue),
      newValue: String(newValue),
      metadata,
    });
    await activity.save();
    return activity;
  }

  async getTaskActivities(taskId, currentUser) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (project) {
      projectService.checkProjectAccess(project, currentUser._id, currentUser.role);
    }

    const activities = await Activity.find({ task: taskId })
      .populate('user', 'name email avatar role')
      .sort({ createdAt: -1 });

    return activities;
  }
}

module.exports = new ActivityService();
