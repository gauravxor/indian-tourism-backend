const logoutController = (req, res) => {
    if (JSON.stringify(req.cookies) === '{}' || req.cookies.accessToken === undefined) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'missing token',
                details: 'access tokens are needed to logout',
            },
        });
    }
    return res.clearCookie('accessToken').status(204).send();
};

module.exports = logoutController;
