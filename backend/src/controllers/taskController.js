const taskService = require('../services/taskService');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            201,
            'Task created successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const getAllTasks = async (req, res, next) => {
    try {
        const { tasks, pagination } = await taskService.getAllTasks(
            req.user,
            req.query
        );

        return sendPaginated(
            res,
            200,
            'Tasks retrieved successfully',
            tasks,
            pagination
        );
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await taskService.getTaskById(
            id,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task retrieved successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await taskService.updateTask(
            id,
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task updated successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const patchStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await taskService.patchStatus(
            id,
            status,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task status updated successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const patchAssign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        const task = await taskService.patchAssign(
            id,
            assignedTo,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task assigned user updated successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const patchPosition = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await taskService.patchPosition(
            id,
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Task position updated successfully',
            task
        );
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        await taskService.deleteTask(id, req.user);

        return sendSuccess(
            res,
            200,
            'Task deleted successfully'
        );
    } catch (error) {
        next(error);
    }
};

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await taskService.getDashboardStats(req.user);

        return sendSuccess(
            res,
            200,
            'Dashboard statistics retrieved successfully',
            stats
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    patchStatus,
    patchAssign,
    patchPosition,
    deleteTask,
    getDashboardStats,
};