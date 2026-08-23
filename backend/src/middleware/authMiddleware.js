const { verifyAccessToken } = require('../utils/token');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(
                401,
                'Authentication required. No token provided.'
            );
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(
                401,
                'Authentication required. Invalid token format.'
            );
        }

        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            throw new ApiError(
                401,
                'User account is invalid or deactivated.'
            );
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(
                new ApiError(401, 'Invalid authentication token.')
            );
        }

        if (error.name === 'TokenExpiredError') {
            return next(
                new ApiError(
                    401,
                    'Authentication token expired. Please refresh token.'
                )
            );
        }

        next(error);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new ApiError(401, 'Authentication required.')
            );
        }
        console.log("bhgefgeyfgefy",req.user.role)

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    `User role '${req.user.role}' is not authorized to access this resource.`
                )
            );
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize,
};