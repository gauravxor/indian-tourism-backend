const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const Credentials = require('../../models/credentials');
const Auth = require('../../utility/authUtil');

const signInController = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	performAuth();
	async function performAuth()
	{
		const userSearchResult = await Auth.searchUser(email);
		if(userSearchResult == null)
			res.status(404).send({msg: "User not found"});
		else
		{
			const userId = userSearchResult._id;
			credentialsSearchResult = await Auth.searchCredentials(userId);
			if(credentialsSearchResult == null)
				res.status(404).send({msg: "Credentials not found"});
			else
			{
				if(credentialsSearchResult.isLoggedIn == true)
					res.status(404).send({msg: "User already logged in"});
				else{
					const passwordHash = credentialsSearchResult.password;
					const validateResult = await Auth.validatePass(password, passwordHash);
					if(validateResult){
						const token = Auth.generateJWToken(userId);

						res.status(200).send({
							msg: "Password matched",
							accessToken: token
						});
					}
					else
						res.status(404).send({msg: "Password not matched"});
				}
			}
		}
	}
}

module.exports = signInController;