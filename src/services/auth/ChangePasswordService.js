const UserRepository = require('@repositories/UserRepository');
const CredentialsRepository = require('@repositories/CredentialsRepository');
const bcrypt = require('bcryptjs');

const {
    NotFoundError,
    AuthenticationError,
} = require('@utils/errors');

const AUTH = require('@helpers/authHelper');

class ChangePasswordService {
    static async handle(userId, oldPassword, newPassword) {

        const searchUserResult = await UserRepository.searchUserById(userId);
        if (!searchUserResult) {
            const error = new NotFoundError('User not found');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const userCredentials = await CredentialsRepository.searchCredentials(userId);
        const oldPasswordHash = userCredentials.password;

        const isOldPasswordValid = await AUTH.validatePass(oldPassword, oldPasswordHash);
        if (!isOldPasswordValid) {
            const error = new AuthenticationError('Incorrect old password');
            error.code = 'OLD_PASSWORD_INCORRECT';
            throw error;
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await CredentialsRepository.updatePassword(userId, newPasswordHash);
    }
}

module.exports = ChangePasswordService;
