const logger = require('@config/logger');

const ForgotPasswordService = require('@services/auth/ForgotPasswordService');
const ChangePasswordService = require('@services/auth/ChangePasswordService');
const ResetPasswordService = require('@services/auth/ResetPasswordService');
const OtpService = require('@services/auth/OtpService');

const { NotFoundError } = require('@utils/errors');

const forgotPassword = async (req, res) => {
    const email = req.body.email;

    try {
        await ForgotPasswordService.handle(email);
        logger.info('Password Controller: Password reset email sent');
        return res.status(200)
            .json({
                status: 'success',
                code: 200,
                data: {
                    message: 'password reset email sent',
                    details: 'password reset email sent',
                },
            });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404)
                .json({
                    status: 'failure',
                    code: 404,
                    error: {
                        message: 'user not found',
                        details: 'user not found in database',
                    },
                });
        }
        console.log('Password Controller: Failed to send password reset email');
        return res.status(500)
            .json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'reset email not sent',
                    details: 'failed to send password reset email',
                },
            });
    }
};

/**
 * Requires authentication
 * This function handles the password change request, once the
 * password reset OTP is validated.
 */
const changePassword = async (req, res) => {
    const {
        userId,
        oldPassword,
        newPassword,
    } = req.body;

    try {
        await ChangePasswordService.handle(userId, oldPassword, newPassword);

    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404)
                .json({
                    status: 'failure',
                    code: 404,
                    error: {
                        msg: 'user not found',
                        details: 'user not found in database',
                    },
                });
        }
        return res.status(500)
            .json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'password update failed',
                    details: 'password update failed',
                },
            });
    }
};

/**
 * Does not require authentication
 * This controller is to handle password reset requests, for non loggedin users
 */
const resetPassword = async (req, res) => {
    const {
        email,
        otp,
        newPassword,
    } = req.body;

    const isOtpValid = OtpService.verifyOtp(otp, email, 'password_reset');
    if (!isOtpValid) {
        return res.status(500)
            .json({
                status: 'failure',
                code: 401,
                error: {
                    message: 'invalid otp',
                    details: 'invalid otp',
                },
            });
    }

    try {
        await ResetPasswordService.handle(email, newPassword);
    } catch (error) {
        return res.status(500)
            .json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'password reset failed',
                    details: 'password reset failed',
                },
            });
    }
};

module.exports = {
    changePassword,
    forgotPassword,
    resetPassword,
};
