const sendSuccess = (
    res,
    statusCode = 200,
    message = 'Success',
    data = null,
    meta = null
) => {
    const response = {
        success: true,
        message,
        data
    };

    if (meta) {
        response.pagination = meta;
    }

    return res.status(statusCode).json(response);
};

const sendPaginated = (
    res,
    statusCode = 200,
    message = 'Success',
    data = [],
    pagination = {}
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            page: Number(pagination.page) || 1,
            limit: Number(pagination.limit) || 10,
            total: Number(pagination.total) || 0,
            totalPages:
                Math.ceil(
                    (pagination.total || 0) /
                    (pagination.limit || 10)
                ) || 1
        }
    });
};

module.exports = {
    sendSuccess,
    sendPaginated
};