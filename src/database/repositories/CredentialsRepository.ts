import { CredentialsModel, ICredentials } from "@models/credential";
import logger from "@config/logger";

class CredentialsRepository {
    static async searchCredentials(
        userId: string
    ): Promise<ICredentials | null> {
        logger.info(`Searching credentials for userId: ${userId}`);
        const searchResult = await CredentialsModel.findOne({ userId: userId });
        return searchResult;
    }

    static async updatePassword(
        email: string,
        passwordHash: string
    ): Promise<ICredentials | null> {
        logger.info(`Updating password for email: ${email}`);
        const updateResult = await CredentialsModel.findOneAndUpdate(
            { email: email },
            { password: passwordHash },
            { new: true }
        );
        return updateResult;
    }
}

export default CredentialsRepository;
