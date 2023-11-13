const bcrypt = require('bcryptjs');

const CredentialModel = require('../models/credentialModel');
const UserModel = require('../models/userModel');
const AdminModel = require('../models/adminModel');

/** Function to search User using email in USER collection */
async function searchUser(email) {
    const searchResult = await UserModel.findOne({
        'contact.email': email,
    });
    return searchResult;
}

/** Function to search Admin using email in ADMIN collection */
async function searchAdmin(email) {
    const searchResult = await AdminModel.findOne({
        'contact.email': email,
    });
    return searchResult;
}

/** Function to search User using User Document ID in USER collection */
async function searchUserById(userId) {
    const searchResult = await UserModel.findById(userId);
    return searchResult;
}

/** Function to search Admin using Admin Document ID in ADMIN collection */
async function searchAdminUserById(adminId) {
    const searchResult = await AdminModel.findById(adminId);
    return searchResult;
}

/** Function to search Credentials for a user using User's Document Id */
async function searchCredentials(userId) {
    const searchResult = await CredentialModel.findOne({
        userId: userId,
    });
    return searchResult;
}

/** Function to validate user password */
async function validatePass(plaintextPassword, hash) {
    const hashCheckResult = await bcrypt.compare(plaintextPassword, hash);
    return hashCheckResult;
}

/** Function to update password in CREDENTIALS collection */
async function updatePassword(documentId, hash) {
    const updateResult = await CredentialModel.findByIdAndUpdate(documentId, {
        password: hash,
    });
    return updateResult;
}

module.exports = {
    searchCredentials,
    searchUser,
    searchAdmin,
    validatePass,
    updatePassword,
    searchUserById,
    searchAdminUserById,
};
