const crypto = require('crypto');

const OTP = require('../../helper/otpHelper');
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const CredentialModel = require('../../models/credentialModel');

const otpController = async (req, res) => {
    const requestOtp = req.body.otp;
    const requestEmail = req.body.email;
    const requestOtpType = req.body.otpType;

    /** Checking if email id is received with the request. */
    if (requestEmail === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'invalid request',
                details: 'missing email id from request body',
            },
        });
    }

    /** Checking if we received a valid otp type */
    if (requestOtpType !== 'emailVerification' && requestOtpType !== 'passwordReset') {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'invalid otp type',
                details: 'requested otp type was not recognised',
            },
        });
    }

    /** Checking if the recevied email belong to any user */
    const userSearchResult = await AUTH.searchUser(requestEmail);
    if (!userSearchResult) {
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'invalid user',
                details: 'user not found in database',
            },
        });
    }

    const verifyOtpResult = await OTP.verifyOtp(requestEmail, requestOtp, requestOtpType);
    if (verifyOtpResult === 'otp expired') {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'otp expired',
                details: 'received otp was expired',
            },
        });
    }
    if (verifyOtpResult === 'invalid otp') {
        console.log('OTP CONTROLLER : OTP expired or invalid otp'.yellow);
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'incorrect otp',
                details: 'received otp was incorrect',
            },
        });
    }

    /** If request is for email verification and OTP is validated, generate the tokens */
    if (requestOtpType === 'emailVerification') {
        const userId = (userSearchResult._id).toString();
        const accessToken = TOKENIZER.generateAccessToken(userId, requestEmail, 'local');
        const refreshToken = TOKENIZER.generateRefreshToken(userId, requestEmail, 'local');
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: false });
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: verifyOtpResult, // {otp validated} or {email verified}
                refreshToken: refreshToken,
            },
        });
    }

    /** If request is for password reset and OTP is validated, generate and send a reset ID */
    if (requestOtpType === 'passwordReset') {
        const resetId = crypto.randomInt(2 ** 32);
        const resetIdExpiry = Date.now() + 1000 * 60 * 2; // 2 minutes
        const result = await CredentialModel.findOneAndUpdate(
            { userId: userSearchResult._id },
            { resetId: resetId, resetIdExpiry: resetIdExpiry },
        );

        if (result === null) {
            return res.status(500).json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'database error',
                    details: 'failed to update resetId in database',
                },
            });
        }
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'otp validated',
                resetId,
            },
        });
    }
};

module.exports = otpController;
