const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const commentController = require('../controllers/commentController');
const activityController = require('../controllers/activityController');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createTaskSchema,
  updateTaskSchema,
  patchStatusSchema,
  patchAssignSchema,
  patchPositionSchema,
} = require('../validators/taskValidator');
const { createCommentSchema } = require('../validators/commentValidator');

router.use(authenticate);

router.get('/dashboard/stats', taskController.getDashboardStats);

router.route('/')
  .get(taskController.getAllTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router.route('/:id')
  .get(taskController.getTaskById)
  .put(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

router.patch('/:id/status', validate(patchStatusSchema), taskController.patchStatus);
router.patch('/:id/assign', validate(patchAssignSchema), taskController.patchAssign);
router.patch('/:id/position', validate(patchPositionSchema), taskController.patchPosition);

// Comment subroutes for tasks
router.route('/:taskId/comments')
  .get(commentController.getCommentsByTask)
  .post(validate(createCommentSchema), commentController.createComment);

// Activity subroutes for tasks
router.get('/:taskId/activity', activityController.getTaskActivities);

module.exports = router;
