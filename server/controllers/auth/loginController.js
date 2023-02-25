/**
 * This purpose of this file is to handle the login requests.
 *
 * THE LOGIN PROCESS:
 * The client sends a POST request to the server with the email and password.
 * This request is handled by this file loginController.
 * The login controller receives the EMAIL and PASSWORD from the client.
 *
 * It then searches the USER database for the user with the given email.
 * If the user is not found, then it sends a 404 response.
 * If the user is found, then it searches the database for the credentials of the user.
 * If the credentials are not found, then it sends a 404 response.
 * If the credentials are found, then it checks if the user is already logged in.
 * If the user is already logged in, then it sends a 404 response.
 * If the user is not logged in, then it validates the password.
 * If the password is invalid, then it sends a 404 response.
 * If the password is valid, then it generates an access token and a refresh token.
 * It then updates the login status of the user in the database.
 * It then sends a 200 response with the access token and the refresh token.
 */

const Auth = require('../../helper/authHelper');
const Tokenizer = require('../../helper/jwtHelper');

const loginController = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const userSearchResult = await Auth.searchUser(email);
	if(userSearchResult == null)
		res.status(404).send({msg: "User not found"});
	else
	{
		// storing the current user's id and email. These will be used to create the access token and refresh token.
		const userId = userSearchResult._id;
		const email = userSearchResult.contact.email;

		const credentialsSearchResult = await Auth.searchCredentials(userId);
		if(credentialsSearchResult == null)
			res.status(404).send({
				msg: "Credentials not found, invalid user"});
		else
		{
			if(credentialsSearchResult.isLoggedIn == true)
				res.status(404).send({
					msg: "User already logged in. Please logout to continue"
				});
			else
			{
				const passwordHash = credentialsSearchResult.password;
				const validateResult = await Auth.validatePass(password, passwordHash);
				if(validateResult)
				{
					const accessToken = await Tokenizer.generateAccessToken(userId, email);
					const refreshToken = await Tokenizer.generateRefreshToken(userId, email);

					// updating the login status in credentials collection.
					await Auth.updateLoginStatus(credentialsSearchResult._id, true);

					// sending the access token and refresh token to the client.
					res.cookie('accessToken', accessToken,{httpOnly: true})
					.cookie('refreshToken', refreshToken, {httpOnly: true})
					.status(200);

					// checking if the email is verified or not.
					// if not verified, then ask the user to verify the email.
					if(userSearchResult.isEmailVerified == false){
						return res.send({
							msg: "Email not verified, please verify your email to processed further",
							userId: userSearchResult._id,
							email: userSearchResult.contact.email,
							accessToken: accessToken,
							refreshToken: refreshToken
						});
					}
					else{
						// if email is verified, then allow the user to proceed further.
						res.send({
							msg: "Logged in successfully",
							userId: userSearchResult._id,
							email: userSearchResult.contact.email,
							accessToken: accessToken,
							refreshToken: refreshToken
						});
					}
				}
				else
					res.status(404).send({msg: "Password not matched"});
			}
		}
	}
}

module.exports = loginController;
