const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { updateBoardSchema } = require('../validators/boardValidator');

router.use(authenticate);

router.route('/:id')
  .get(boardController.getBoardById)
  .put(validate(updateBoardSchema), boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
