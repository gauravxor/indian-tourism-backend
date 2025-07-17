const logger = require('@config/logger');
const AuthService = require('@services/auth/LoginService');
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
        return res.status(400)
            .json({
                status: 'failure',
                code: 400,
                error: {
                    message: 'bad request',
                    details: 'credentials not provided',
                },
            });
    }

    logger.info(`Login attempt for ${email}, isAdmin: ${isAdmin}`);

    try {
        const loginResult = await AuthService.login(email, password, isAdmin);

        res.cookie('accessToken', loginResult.accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });

        return res.status(200)
            .json({
                status: 'success',
                code: 200,
                data: {
                    message: 'logged in',
                    refreshToken: loginResult.refreshToken,
                    userId: loginResult.userId,
                },
            });
    } catch (error) {
        logger.error('Login Controller Error:', error);
        if (error instanceof ValidationError) {
            return res.status(400)
                .json({
                    status: 'failure',
                    code: 400,
                    error: {
                        message: error.message,
                        details: error.details,
                    },
                });
        }

        if (error instanceof NotFoundError) {
            return res.status(404)
                .json({
                    status: 'failure',
                    code: 404,
                    error: {
                        message: error.message,
                        details: error.details,
                    },
                });
        }

        if (error instanceof AuthenticationError) {
            return res.status(401)
                .json({
                    status: 'failure',
                    code: 401,
                    error: {
                        message: error.message,
                        details: error.details,
                    },
                });
        }

        if (error.code === 'EMAIL_NOT_VERIFIED') {
            return res.status(202)
                .json({
                    status: 'success',
                    code: 202,
                    data: {
                        message: 'email not verified',
                        details: 'could not generate tokens because email id not verified',
                    },
                });
        }

        return res.status(500)
            .json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'internal server error',
                    details: 'something went wrong',
                },
            });
    }
};

module.exports = loginController;
