const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Credentials = require("../models/credentialModel");


// helper function to search User using email in USER collection
async function searchUser(email){
	const searchResult = await User.findOne({ "contact.email": email })
	return searchResult;
}

// helper function to search User using userId in CREDENTIALS collection
async function searchCredentials(userId){
	const searchResult = await Credentials.findOne({ "userId": userId });
	return searchResult;
}

// helper function to validate user password while login
async function validatePass(plaintextPassword, hash){
	const result = await bcrypt.compare(plaintextPassword, hash);
	console.log("hash check result = " + result);
	return result;
}

// helpper function to update login status in CREDENTIALS collection
async function updateLoginStatus(documentId, value)
{
	console.log("The dcoument is = " + documentId);
	const queryResult = await Credentials.findByIdAndUpdate(documentId, {isLoggedIn: value});
	return queryResult;
}




module.exports = {
	searchCredentials,
	searchUser,
	validatePass,
	updateLoginStatus,
};