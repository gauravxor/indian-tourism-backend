import UserRepository from "@repositories/UserRepository";
import { NotFoundError } from "@utils/errors";
import * as OTP from "@helpers/otpHelper";

class ForgotPasswordService {
    static async handle(email: string): Promise<void> {
        const searchUserResult = await UserRepository.searchUser(email);
        if (!searchUserResult) {
            throw new NotFoundError("User not found");
        }

        const userId = searchUserResult._id.toString();
        await OTP.sendPasswordResetEmail(email, userId);
    }
}

export default ForgotPasswordService;
