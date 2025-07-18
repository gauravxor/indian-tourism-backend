const { apiError } = require('@utils/responseHelper');

const logoutController = (req, res) => {
    if (JSON.stringify(req.cookies) === '{}' || req.cookies.accessToken === undefined) {
        return apiError(res, 401, 'access tokens not provided');
    }

    return res.clearCookie('accessToken')
        .status(204)
        .send();
};

module.exports = logoutController;
