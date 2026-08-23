const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors || {}).map((e) => ({
                field: e.path,
                message: e.message
            }));

            error = new ApiError(400, 'Validation Error', errors);
        } else if (err.code === 11000) {
            const field = Object.keys(err.keyValue || {})[0] || 'field';

            error = new ApiError(
                400,
                `Duplicate field value entered for '${field}'`,
                [{ field, message: 'Value already exists' }]
            );
        } else if (err.name === 'CastError') {
            error = new ApiError(
                400,
                `Invalid format for field '${err.path}'`
            );
        } else {
            error = new ApiError(
                err.statusCode || 500,
                err.message || 'Internal Server Error'
            );
        }
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        errors: error.errors || []
    });
};

module.exports = errorHandler;