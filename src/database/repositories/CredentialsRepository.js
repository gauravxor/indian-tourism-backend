const CredentialModel = require('@models/credential');
const logger = require('@config/logger');

class CredentialsRepository {
    static async searchCredentials(userId) {
        logger.info(`Searching credentails for userId: ${userId}`);
        const searchResult = CredentialModel.findOne({ userId: userId });
        return searchResult;
    }
}

module.exports = new CredentialsRepository();
