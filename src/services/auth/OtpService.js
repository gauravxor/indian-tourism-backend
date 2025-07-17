const UserRepository = require('@repositories/UserRepository');
const {
    OtpError,
    NotFoundError,
} = require('@utils/errors');
const OTP = require('@helpers/otpHelper');

class OtpService {
    static async verifyOtp(otp, email, otpType) {
        /** Checking if the received email belong to any user */
        const userSearchResult = await UserRepository.searchUser(email);
        if (!userSearchResult) {
            const error = new NotFoundError('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const verifyOtpResult = await OTP.verifyOtp(email, otp, otpType);
        if (verifyOtpResult === 'otp expired') {
            const error = new OtpError('Otp Expired');
            error.code = 'OTP_EXPIRED';
            throw error;
        }
        if (verifyOtpResult === 'invalid otp') {
            const error = new OtpError('Invalid Otp');
            error.code = 'INVALID_OTP';
            throw error;
        }

        return {
            otpVerified: true,
            userId: userSearchResult._id,
        };
    }
}

module.exports = OtpService;
