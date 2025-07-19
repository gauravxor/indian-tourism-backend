import bcrypt from "bcryptjs";

import { CredentialsModel } from "@models/credential";
import { UserModel } from "@models/user";
import { AdminModel } from "@models/admin";

/** Function to search User using email in USER collection
 * @deprecated use the function from UserRepository
 */
async function searchUser(email: string) {
    const searchResult = await UserModel.findOne({
        "contact.email": email,
    });
    return searchResult;
}

/** Function to search Admin using email in ADMIN collection
 * @deprecated use the function from AdminRepository
 */
async function searchAdmin(email: string) {
    const searchResult = await AdminModel.findOne({
        "contact.email": email,
    });
    return searchResult;
}

/** Function to search User using User Document ID in USER collection
 * @deprecated
 */
async function searchUserById(userId: string) {
    const searchResult = await UserModel.findById(userId);
    return searchResult;
}

/** Function to search Admin using Admin Document ID in ADMIN collection
 * @deprecated
 */
async function searchAdminUserById(adminId: string) {
    const searchResult = await AdminModel.findById(adminId);
    return searchResult;
}

/** Function to search Credentials for a user using User's Document Id
 * @deprecated
 */
async function searchCredentials(userId: string) {
    const searchResult = await CredentialsModel.findOne({
        userId: userId,
    });
    return searchResult;
}

/** Function to validate user password */
async function validatePass(plaintextPassword: string, hash: string) {
    const hashCheckResult = await bcrypt.compare(plaintextPassword, hash);
    return hashCheckResult;
}

/** Function to update password in CREDENTIALS collection
 * @deprecated
 */
async function updatePassword(documentId: string, hash: string) {
    const updateResult = await CredentialsModel.findByIdAndUpdate(documentId, {
        password: hash,
    });
    return updateResult;
}

export {
    searchCredentials,
    searchUser,
    searchAdmin,
    validatePass,
    updatePassword,
    searchUserById,
    searchAdminUserById,
};
