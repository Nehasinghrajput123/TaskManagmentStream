const commentService = require('../services/commentService');
const { sendSuccess } = require('../utils/apiResponse');

const createComment = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;

        const comment = await commentService.createComment(
            taskId,
            content,
            req.user
        );

        return sendSuccess(
            res,
            201,
            'Comment added successfully',
            comment
        );
    } catch (error) {
        next(error);
    }
};

const getCommentsByTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const comments = await commentService.getCommentsByTask(
            taskId,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Comments retrieved successfully',
            comments
        );
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await commentService.updateComment(
            id,
            content,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Comment updated successfully',
            comment
        );
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        await commentService.deleteComment(id, req.user);

        return sendSuccess(
            res,
            200,
            'Comment deleted successfully'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};