const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { updateCommentSchema } = require('../validators/commentValidator');

router.use(authenticate);

router.route('/:id')
  .put(validate(updateCommentSchema), commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
