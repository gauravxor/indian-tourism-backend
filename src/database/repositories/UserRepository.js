const UserModel = require('@models/user');
const logger = require('@config/logger');

class UserRepository {
    static async searchUser(email) {
        logger.info(`Searching user: ${email}`);
        const searchResult = await UserModel.findOne({ 'contact.email': email });
        return searchResult;
    }

    static async searchUserById(userId) {
        logger.info(`Searching user: ${userId}`);
        const searchResult = await UserModel.findById(userId);
        return searchResult;
    }
}

module.exports = UserRepository;
