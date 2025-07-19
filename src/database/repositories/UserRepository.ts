import { UserModel, IUser } from "@models/user";
import logger from "@config/logger";

class UserRepository {
    static async searchUser(email: string): Promise<IUser | null> {
        logger.info(`Searching user: ${email}`);
        const searchResult = await UserModel.findOne({
            "contact.email": email,
        });
        return searchResult;
    }

    static async searchUserById(userId: string): Promise<IUser | null> {
        logger.info(`Searching user: ${userId}`);
        const searchResult = await UserModel.findById(userId);
        return searchResult;
    }
}

export default UserRepository;
