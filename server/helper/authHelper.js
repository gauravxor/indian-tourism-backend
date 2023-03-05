const bcrypt = require("bcrypt");

const CredentialModel	= require("../models/credentialModel");
const UserModel 		= require("../models/userModel");


/** Function to search User using email in USER collection */
async function searchUser(email){
	const searchResult = await UserModel.findOne({
		"contact.email": email
	});
	return searchResult;
}

/** Function to search Credentials for a user using User's Document Id */
async function searchCredentials(userId){
	const searchResult = await CredentialModel.findOne({
		"userId": userId
	});
	return searchResult;
}


/** Function to update User's refresh Token in CREDENTIALS collection using it's Document Id*/
async function updateLoginStatus(documentId, refreshToken)
{
	const updateResult = await CredentialModel.findByIdAndUpdate(documentId,{
		refreshToken: refreshToken
	});
	return updateResult;
}


/** Function to validate user password */
async function validatePass(plaintextPassword, hash){
	const hashCheckResult = await bcrypt.compare(plaintextPassword, hash);
	return hashCheckResult;
}

/** Function to update password in CREDENTIALS collection */
async function updatePassword(documentId, hash)
{
	const updateResult = await CredentialModel.findByIdAndUpdate(documentId,{
		password: hash
	});
	return updateResult;
}


module.exports = {
	searchCredentials,
	searchUser,
	validatePass,
	updateLoginStatus,
	updatePassword,
};