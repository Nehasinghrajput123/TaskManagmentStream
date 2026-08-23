const boardService = require('../services/boardService');
const { sendSuccess } = require('../utils/apiResponse');

const createBoard = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const board = await boardService.createBoard(
            projectId,
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            201,
            'Board created successfully',
            board
        );
    } catch (error) {
        next(error);
    }
};

const getBoardsByProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const boards = await boardService.getBoardsByProject(
            projectId,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Boards retrieved successfully',
            boards
        );
    } catch (error) {
        next(error);
    }
};

const getBoardById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const board = await boardService.getBoardById(
            id,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Board retrieved successfully',
            board
        );
    } catch (error) {
        next(error);
    }
};

const updateBoard = async (req, res, next) => {
    try {
        const { id } = req.params;

        const board = await boardService.updateBoard(
            id,
            req.body,
            req.user
        );

        return sendSuccess(
            res,
            200,
            'Board updated successfully',
            board
        );
    } catch (error) {
        next(error);
    }
};

const deleteBoard = async (req, res, next) => {
    try {
        const { id } = req.params;

        await boardService.deleteBoard(id, req.user);

        return sendSuccess(
            res,
            200,
            'Board deleted successfully'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBoard,
    getBoardsByProject,
    getBoardById,
    updateBoard,
    deleteBoard,
};