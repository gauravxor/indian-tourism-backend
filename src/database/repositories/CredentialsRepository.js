const CredentialModel = require('@models/credential');
const logger = require('@config/logger');

class CredentialsRepository {
    static async searchCredentials(userId) {
        logger.info(`Searching credentials for userId: ${userId}`);
        const searchResult = CredentialModel.findOne({ userId: userId });
        return searchResult;
    }

    static async UpdatePassword(documentId, passwordHash) {
        const updateResult = await CredentialModel.findByIdAndUpdate(documentId, { password: passwordHash });
        return updateResult;
    }
}

module.exports = new CredentialsRepository();
