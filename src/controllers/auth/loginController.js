const logger = require('@config/logger');
const AuthService = require('@services/auth/LoginService');
const {
    apiError,
    apiResponse,
} = require('@utils/responseHelper');
const {
    setCookie,
} = require('@utils/cookieHelper');

const {
    ValidationError,
    AuthenticationError,
    NotFoundError,
} = require('@utils/errors');

const loginController = async (req, res) => {
    const {
        email,
        password,
        isAdmin,
    } = req.body;

    if (!email || !password) {
        return apiError(res, 400, 'credentials not provided');
    }

    logger.info(`Login attempt for ${email}, isAdmin: ${isAdmin}`);

    try {
        const loginResult = await AuthService.login(email, password, isAdmin);
        setCookie(res, 'accessToken', loginResult.accessToken);
        return apiResponse(res, 200, 'logged in', {
            refreshToken: loginResult.refreshToken,
            userId: loginResult.userId,
        });
    } catch (error) {
        logger.error('Login Controller Error:', error);
        if (error instanceof ValidationError) {
            return apiError(res, 400, error.message);
        }

        if (error instanceof NotFoundError) {
            return apiError(res, 404, error.message);
        }

        if (error instanceof AuthenticationError) {
            return apiError(res, 401, error.message);
        }

        if (error.code === 'EMAIL_NOT_VERIFIED') { // Todo: create enums for it
            return apiResponse(res, 202, 'email not verified');
        }

        return apiError(res, 500, 'internal server error');
    }
};

module.exports = loginController;
