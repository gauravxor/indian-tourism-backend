const OTP = require('../../helper/otpHelper');
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const otpController = async (req, res) => {
    const requestOtp = req.body.otp;
    const requestEmail = req.body.email;
    const requestOtpType = req.body.otpType;

    /** Checking if email id is received with the request. */
    if (requestEmail === null) {
        return res.status(400).json({
            status: 'failure',
            msg: 'Email is required',
        });
    }

    /** Checking if the recevied email is registered one! */
    const userSearchResult = await AUTH.searchUser(requestEmail);
    if (userSearchResult === null) {
        return res.status(404).json({
            status: 'failure',
            msg: 'User not found',
        });
    }

    const verifyOtpResult = await OTP.verifyOtp(requestEmail, requestOtp, requestOtpType);
    if (verifyOtpResult === 'emailError') {
        console.log('OTP CONTROLLER : User not found in DB'.red);
        return res.status(200).json({
            status: 'failure',
            msg: 'User not found',
        });
    }
    if (verifyOtpResult === 'otpError') {
        console.log('OTP CONTROLLER : OTP expired or invalid otp'.yellow);
        return res.status(200).json({
            status: 'failure',
            msg: 'OTP expired or invalid otp',
        });
    }

    /** If OTP was validated, generate the tokens */
    const userId = (userSearchResult._id).toString();
    const accessToken = TOKENIZER.generateAccessToken(userId, requestEmail, 'local');
    const refreshToken = TOKENIZER.generateRefreshToken(userId, requestEmail, 'local');
    const message = (verifyOtpResult === 'emailVerified') ? 'Email verified' : 'OTP validated';
    return res.status(200).json({
        status: 'success',
        msg: message,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
};

module.exports = otpController;
