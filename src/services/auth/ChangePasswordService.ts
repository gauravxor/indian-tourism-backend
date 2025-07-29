import bcrypt from 'bcryptjs';

import UserRepository from '@repositories/UserRepository';
import CredentialsRepository from '@repositories/CredentialsRepository';
import logger from '@root/src/config/logger';
import { AuthenticationError, NotFoundError } from '@utils/errors';
import { validatePass } from '@helpers/authHelper';

class ChangePasswordService {
    static async handle(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        const searchUserResult = await UserRepository.searchUserById(userId);
        if (!searchUserResult) {
            throw new NotFoundError('User not found');
        }

        const userCredentials = await CredentialsRepository.searchCredentials(userId);
        if (!userCredentials) {
            logger.error(`Credentials not found for userId: ${userId}`);
            // TODO: find better way rather than returning NotFound, as this is a critical error
            throw new NotFoundError('Credentials not found');
        }

        const oldPasswordHash = userCredentials.password;

        const isOldPasswordValid = await validatePass(oldPassword, oldPasswordHash);

        if (!isOldPasswordValid) {
            throw new AuthenticationError('Incorrect old password');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await CredentialsRepository.updatePassword(userId, newPasswordHash);
    }
}

export default ChangePasswordService;
