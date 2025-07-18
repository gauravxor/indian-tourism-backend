const TOKENIZER = require('@helpers/jwtHelper');
const OtpService = require('@services/auth/OtpService');
const OtpError = require('@utils/errors/OtpError');

const {
    apiError,
    apiResponse,
} = require('@utils/responseHelper');

const { setCookie } = require('@utils/cookieHelper');

const otpController = async (req, res) => {
    const {
        otp,
        email,
        otpType,
    } = req.body;

    /** Checking if email id is received with the request. */
    if (!email) {
        return apiError(res, 400, 'email not received');
    }

    /** Checking if we received a valid otp type */
    if (otpType !== 'emailVerification' && otpType !== 'passwordReset') {
        return apiError(res, 400, 'invalid otp type');
    }

    try {
        const verificationResult = await OtpService.verifyOtp(otp, email, otp);
        const userId = verificationResult.userId;

        /** If request is for email verification and OTP is validated, generate the tokens */
        if (otpType === 'emailVerification') {
            const accessToken = TOKENIZER.generateAccessToken(userId, email, 'local');
            const refreshToken = TOKENIZER.generateRefreshToken(userId, email, 'local');
            setCookie(res, 'accessToken', accessToken);
            return apiResponse(res, 200, verificationResult, { refreshToken: refreshToken });
        }
    } catch (error) {
        if (error instanceof OtpError) {
            return apiError(res, 401, error.message, error.details);
        }

        return apiError(res, 500, 'internal server error');
    }
};

module.exports = otpController;
