const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const boardController = require('../controllers/boardController');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} = require('../validators/projectValidator');
const { createBoardSchema } = require('../validators/boardValidator');

router.use(authenticate);

router.route('/')
  .get(projectController.getAllProjects)
  .post(validate(createProjectSchema), projectController.createProject);

router.route('/:id')
  .get(projectController.getProjectById)
  .put(validate(updateProjectSchema), projectController.updateProject)
  .delete(projectController.deleteProject);

router.route('/:id/members')
  .get(projectController.getMembers)
  .post(validate(addMemberSchema), projectController.addMember);

router.delete('/:id/members/:userId', projectController.removeMember);

// Board subroutes for project
router.route('/:projectId/boards')
  .get(boardController.getBoardsByProject)
  .post(validate(createBoardSchema), boardController.createBoard);

module.exports = router;
