const UserRepository = require('@repositories/UserRepository');
const CredentialsRepository = require('@repositories/CredentialsRepository');
const bcrypt = require('bcryptjs');

const {
    NotFoundError,
} = require('@utils/errors');

class ResetPasswordService {
    static async handle(email, newPassword) {
        const searchUserResult = await UserRepository.searchUser(email);
        if (!searchUserResult) {
            const error = new NotFoundError('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await CredentialsRepository.updatePassword(email, newPasswordHash);
    }
}

module.exports = ResetPasswordService;
