const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        return sendSuccess(
            res,
            201,
            'User registered successfully',
            result
        );
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        return sendSuccess(
            res,
            200,
            'Login successful',
            result
        );
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);

        return sendSuccess(
            res,
            200,
            'Token refreshed successfully',
            result
        );
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user._id);

        return sendSuccess(
            res,
            200,
            'Logged out successfully'
        );
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);

        return sendSuccess(
            res,
            200,
            'Current user retrieved successfully',
            user
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe,
};