const userService = require('../services/userService');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const { users, pagination } = await userService.getAllUsers(
            req.query
        );

        return sendPaginated(
            res,
            200,
            'Users retrieved successfully',
            users,
            pagination
        );
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        return sendSuccess(
            res,
            200,
            'User retrieved successfully',
            user
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
};