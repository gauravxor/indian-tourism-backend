const UserRepository = require('@repositories/UserRepository');
const { NotFoundError } = require('@utils/errors');
const OTP = require('@helpers/otpHelper');

class ForgotPasswordService {
    static async handle(email) {
        const searchUserResult = await UserRepository.searchUser(email);
        if (!searchUserResult) {
            const error = new NotFoundError('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const userId = searchUserResult._id;
        await OTP.sendPasswordResetEmail(email, userId);
    }
}

module.exports = ForgotPasswordService;
