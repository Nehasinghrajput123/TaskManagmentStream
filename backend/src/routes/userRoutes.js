const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
