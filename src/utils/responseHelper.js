function apiResponse(res, statusCode = 200, message = 'success', data = {}) {
    return res.status(statusCode)
        .json({
            message: message,
            statusCode: statusCode,
            data: data,
        });
}

function apiError(res, statusCode = 500, message = 'failure', errors = null) {
    return res.status(statusCode)
        .json({
            message: message,
            statusCode: statusCode,
            errors: errors,
        });
}

module.exports = {
    apiError,
    apiResponse,
};
