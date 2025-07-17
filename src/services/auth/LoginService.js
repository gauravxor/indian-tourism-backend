const logger = require('@config/logger');
const UserRepository = require('@repositories/UserRepository');
const CredentialsRepository = require('@repositories/CredentialsRepository');
const AdminRepository = require('@repositories/AdminRepository');

const TOKENIZER = require('@helpers/jwtHelper');
const AUTH = require('@helpers/authHelper');
const {
    AuthenticationError,
    NotFoundError,
} = require('@utils/errors');

class LoginService {
    static async login(email, password, isAdmin) {
        try {
            const user = await this.findUserByEmail(email, isAdmin);

            if (!user) {
                throw new NotFoundError(
                    'user not found',
                    'user with given email id does not exist',
                );
            }

            await this.verifyUserCredentials(user._id, password);

            if (!user.isEmailVerified && !isAdmin) {
                const error = new Error('Email not verified');
                error.code = 'EMAIL_NOT_VERIFIED';
                throw error;
            }

            const tokens = this.generateTokens(user, isAdmin);

            logger.info('Successful login for user:', user.contact.email);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                userId: user._id,
            };
        } catch (error) {
            logger.error('AuthService login error:', error);
            throw error;
        }
    }

    static async findUserByEmail(email, isAdmin) {
        if (isAdmin) {
            return await AdminRepository.searchAdmin(email);
        }
        return await UserRepository.searchUser(email);
    }

    static async verifyUserCredentials(userId, password) {
        const credentials = await CredentialsRepository.searchCredentials(userId);

        if (!credentials) {
            throw new Error('User credentials not found');
        }

        const isValidPassword = await AUTH.validatePass(password, credentials.password);

        if (!isValidPassword) {
            throw new AuthenticationError(
                'incorrect password',
                'incorrect password was provided',
            );
        }
    }

    static generateTokens(user, isAdmin) {
        const userType = isAdmin ? 'admin' : 'local';
        const userId = user._id;
        const userEmail = user.contact.email;

        return {
            accessToken: TOKENIZER.generateAccessToken(userId, userEmail, userType),
            refreshToken: TOKENIZER.generateRefreshToken(userId, userEmail, userType),
        };
    }
}

module.exports = LoginService;
