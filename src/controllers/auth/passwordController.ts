import { Request, Response } from 'express';

import logger from '@root/src/config/logger';
import ForgotPasswordService from '@services/auth/ForgotPasswordService';
import ChangePasswordService from '@services/auth/ChangePasswordService';
import ResetPasswordService from '@services/auth/ResetPasswordService';
import OtpService from '@services/auth/OtpService';
import { NotFoundError } from '@utils/errors';
import { apiError, apiResponse } from '@utils/responseHelper';

const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
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
const changePassword = async (req: Request, res: Response): Promise<Response> => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        await ChangePasswordService.handle(userId, oldPassword, newPassword);
        return apiResponse(res, 200, 'password changed');
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
const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, newPassword } = req.body;

    const isOtpValid = OtpService.verifyOtp(otp, email, 'password_reset');
    if (!isOtpValid) {
        return apiError(res, 401, 'invalid OTP');
    }

    try {
        await ResetPasswordService.handle(email, newPassword);
        return apiResponse(res, 200, 'password reset successful');
    } catch (error) {
        return apiError(res, 500, 'internal server error');
    }
};

export { changePassword, forgotPassword, resetPassword };
