const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/task/:taskId', activityController.getTaskActivities);

module.exports = router;
