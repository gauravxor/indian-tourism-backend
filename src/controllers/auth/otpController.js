const crypto = require('crypto');
const TOKENIZER = require('@helpers/jwtHelper');

const CredentialModel = require('@models/credential');
const OtpService = require('@services/auth/OtpService');
const OtpError = require('@utils/errors/OtpError');

const otpController = async (req, res) => {
    const {
        otp,
        email,
        otpType,
    } = req.body;

    /** Checking if email id is received with the request. */
    if (!email) {
        return res.status(400)
            .json({
                status: 'failure',
                code: 400,
                error: {
                    message: 'invalid request',
                    details: 'missing email id from request body',
                },
            });
    }

    /** Checking if we received a valid otp type */
    if (otpType !== 'emailVerification' && otpType !== 'passwordReset') {
        return res.status(400)
            .json({
                status: 'failure',
                code: 400,
                error: {
                    message: 'invalid otp type',
                    details: 'requested otp type was not recognised',
                },
            });
    }

    try {
        const verificationResult = await OtpService.verifyOtp(otp, email, otp);
        const userId = verificationResult.userId;

        /** If request is for email verification and OTP is validated, generate the tokens */
        if (otpType === 'emailVerification') {
            const accessToken = TOKENIZER.generateAccessToken(userId, email, 'local');
            const refreshToken = TOKENIZER.generateRefreshToken(userId, email, 'local');
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            });
            return res.status(200)
                .json({
                    status: 'success',
                    code: 200,
                    data: {
                        message: verificationResult,
                        refreshToken: refreshToken,
                    },
                });
        }

        /** If request is for password reset and OTP is validated, generate and send a reset ID */
        // TODO: remove the password reset logic and create a separate functionality
        if (otpType === 'passwordReset') {
            const resetId = crypto.randomInt(2 ** 32);
            const resetIdExpiry = Date.now() + 1000 * 60 * 2; // 2 minutes
            const result = await CredentialModel.findOneAndUpdate(
                { userId: userId },
                {
                    resetId: resetId,
                    resetIdExpiry: resetIdExpiry,
                },
            );

            if (result === null) {
                return res.status(500)
                    .json({
                        status: 'failure',
                        code: 500,
                        error: {
                            message: 'database error',
                            details: 'failed to update resetId in database',
                        },
                    });
            }
            return res.status(200)
                .json({
                    status: 'success',
                    code: 200,
                    data: {
                        message: 'otp validated',
                        resetId,
                    },
                });
        }
    } catch (error) {
        if (error instanceof OtpError) {
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

module.exports = otpController;
