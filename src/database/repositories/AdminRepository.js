const AdminModel = require('@models/admin');
const logger = require('@config/logger');

class AdminRepository {
    static async searchAdmin(email) {
        logger.info(`Searching user (admin): ${email}`);
        const searchResult = AdminModel.findOne({ 'contact.email': email });
        return searchResult;
    }

    static async searchAdminById(adminId) {
        const searchResult = await AdminModel.findById(adminId);
        return searchResult;
    }
}

module.exports = new AdminRepository();
