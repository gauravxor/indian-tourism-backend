import { Request, Response } from 'express';

import logger from '@root/src/config/logger';
import AuthService from '@services/auth/LoginService';
import { apiError, apiResponse } from '@utils/responseHelper';
import setCookie from '@utils/cookieHelper';
import { AuthenticationError, NotFoundError, ValidationError } from '@root/src/utils/errors';

const loginController = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, isAdmin } = req.body;

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
    } catch (error: any) {
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

        // TODO : create enums for error codes
        if (error.code === 'EMAIL_NOT_VERIFIED') {
            return apiResponse(res, 202, 'email not verified');
        }

        return apiError(res, 500, 'internal server error');
    }
};

export default loginController;
