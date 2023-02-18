const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Credentials = require("../models/credentials");


async function searchUser(email){
	let searchResult = await User.findOne({ "contact.email": email })
	return searchResult;
}


async function searchCredentials(userId){
	let searchResult = await Credentials.findOne({ "userId": userId });
	return searchResult;
}

async function validatePass(plaintextPassword, hash){
	const result = await bcrypt.compare(plaintextPassword, hash);
	return result;
}

function generateJWToken(userId){
	const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1h"});
	return token;
}

module.exports = {
	searchCredentials,
	searchUser,
	validatePass,
	generateJWToken
};