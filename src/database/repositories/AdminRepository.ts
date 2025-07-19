import { IAdmin, AdminModel } from "@models/admin";
import logger from "@config/logger";

class AdminRepository {
    static async searchAdmin(email: string): Promise<IAdmin | null> {
        logger.info(`Searching user (admin): ${email}`);
        const searchResult = await AdminModel.findOne({
            "contact.email": email,
        });
        return searchResult;
    }

    static async searchAdminById(adminId: string): Promise<IAdmin | null> {
        const searchResult = await AdminModel.findById(adminId);
        return searchResult;
    }
}

export default AdminRepository;
