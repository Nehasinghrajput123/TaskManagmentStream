const activityService = require('../services/activityService');
const { sendSuccess } = require('../utils/apiResponse');

const getTaskActivities = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const activities = await activityService.getTaskActivities(
            taskId,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task activities retrieved successfully',
            activities
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTaskActivities,
};