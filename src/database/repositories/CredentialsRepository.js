const CredentialModel = require('@models/credential');
const logger = require('@config/logger');

class CredentialsRepository {
    static async searchCredentials(userId) {
        logger.info(`Searching credentials for userId: ${userId}`);
        const searchResult = await CredentialModel.findOne({ userId: userId });
        return searchResult;
    }

    static async UpdatePassword(documentId, passwordHash) {
        const updateResult = await CredentialModel.findByIdAndUpdate(documentId, { password: passwordHash });
        return updateResult;
    }

    static async updatePassword(email, newPasswordHash) {
        const updateResult = await CredentialModel.findOneAndUpdate(
            { email: email },
            { password: newPasswordHash },
        );
        return updateResult;
    }
}

module.exports = CredentialsRepository;
