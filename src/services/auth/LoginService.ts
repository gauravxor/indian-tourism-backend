import logger from "@config/logger";

import UserRepository from "@repositories/UserRepository";
import AdminRepository from "@repositories/AdminRepository";
import CredentialsRepository from "@repositories/CredentialsRepository";

import { IUser } from "@models/user";
import { IAdmin } from "@models/admin";
import { validatePass } from "@helpers/authHelper";

import { AuthenticationError, NotFoundError } from "@root/src/utils/errors";
import { generateAccessToken, generateRefreshToken } from "@helpers/jwtHelper";

class LoginService {
    static async login(email: string, password: string, isAdmin: boolean) {
        try {
            const user: IUser | IAdmin | null = await this.findUserByEmail(
                email,
                isAdmin
            );

            if (!user) {
                throw new NotFoundError("user not found");
            }

            await this.verifyUserCredentials(user._id.toString(), password);

            if (!isAdmin) {
                if ("isEmailVerified" in user && !user.isEmailVerified) {
                    throw new Error("Email not verified");
                }
            }

            const tokens = this.generateTokens(user, isAdmin);

            logger.info("Successful login for user:", user.contact.email);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                userId: user._id,
            };
        } catch (error) {
            logger.error("AuthService login error:", error);
            throw error;
        }
    }

    static async findUserByEmail(email: string, isAdmin: boolean) {
        if (isAdmin) {
            return await AdminRepository.searchAdmin(email);
        }
        return await UserRepository.searchUser(email);
    }

    static async verifyUserCredentials(userId: string, password: string) {
        const credentials = await CredentialsRepository.searchCredentials(
            userId
        );

        if (!credentials) {
            throw new Error("User credentials not found");
        }

        const isValidPassword = await validatePass(
            password,
            credentials.password
        );

        if (!isValidPassword) {
            throw new AuthenticationError(
                "incorrect password",
                "incorrect password was provided"
            );
        }
    }

    static generateTokens(user: IUser | IAdmin, isAdmin: boolean) {
        const userType = isAdmin ? "admin" : "local";
        const userId = user._id.toString();
        const userEmail = user.contact.email;

        return {
            accessToken: generateAccessToken(userId, userEmail, userType),
            refreshToken: generateRefreshToken(userId, userEmail, userType),
        };
    }
}

export default LoginService;
