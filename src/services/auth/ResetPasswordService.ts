import UserRepository from "@repositories/UserRepository";
import CredentialsRepository from "@repositories/CredentialsRepository";
import bcrypt from "bcryptjs";

import { NotFoundError } from "@utils/errors";

class ResetPasswordService {
    static async handle(email: string, newPassword: string): Promise<void> {
        const searchUserResult = await UserRepository.searchUser(email);
        if (!searchUserResult) {
            throw new NotFoundError("User not found");
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await CredentialsRepository.updatePassword(email, newPasswordHash);
    }
}

export default ResetPasswordService;
