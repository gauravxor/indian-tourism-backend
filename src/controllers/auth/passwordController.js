const logger = require('@config/logger');

const ForgotPasswordService = require('@services/auth/ForgotPasswordService');
const ChangePasswordService = require('@services/auth/ChangePasswordService');
const ResetPasswordService = require('@services/auth/ResetPasswordService');
const OtpService = require('@services/auth/OtpService');

const { NotFoundError } = require('@utils/errors');
const {
    apiError,
    apiResponse,
} = require('@utils/responseHelper');

const forgotPassword = async (req, res) => {
    const email = req.body.email;

    try {
        await ForgotPasswordService.handle(email);
        logger.info('Password Controller: Password reset email sent');
        return apiResponse(res, 200, 'password reset email sent');
    } catch (error) {
        if (error instanceof NotFoundError) {
            return apiError(res, 404, 'user not found');
        }
        console.log('Password Controller: Failed to send password reset email');
        return apiError(res, 500, 'internal server error');
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
            return apiError(res, 404, 'user not found');
        }
        return apiError(res, 500, 'internal server error');
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
        return apiError(res, 401, 'invalid OTP');
    }

    try {
        await ResetPasswordService.handle(email, newPassword);
    } catch (error) {
        return apiError(res, 500, 'internal server error');
    }
};

module.exports = {
    changePassword,
    forgotPassword,
    resetPassword,
};
