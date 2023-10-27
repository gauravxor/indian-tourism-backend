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

const AUTH		= require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');
const colors	= require('colors');

const loginController = async (req, res, next) => {

	const requestEmail = req.body.email;
	const requestPassword = req.body.password;
	let isUserAdmin = req.body.isAdmin;

	if(requestEmail === "" || requestPassword === ""){
	 	console.log("Login Controller: Bad Request".red);
		return res.status(400).send({
			status: "failure",
			msg: "Bad Request"
		});
	}
	isUserAdmin = (isUserAdmin === "true")? true : false;
	console.log("Login Controller: Is User Admin ? ".yellow + ` ${isUserAdmin}`.cyan);

	let searchUserResult;
	if(isUserAdmin === true)
		searchUserResult = await AUTH.searchAdmin(requestEmail);
	else
		searchUserResult = await AUTH.searchUser(requestEmail);

	if(searchUserResult === null){
		console.log("Login Controller: User not found".red);
		res.status(404).send({
			status: "failure",
			msg: "User not found"
		});
	}
	else
	{
		/** Storing  userid and email to use in the token generation. Data from request is not used for security reasons */
		const userId = searchUserResult._id;
		const userEmail = searchUserResult.contact.email;

		// local and admin user credentials are saved in the same collection
		searchCredentialsResult = await AUTH.searchCredentials(userId);

		if(searchCredentialsResult === null){
			console.log("Login Controller: User credentials not found".red);
			res.status(404).json({
				status: "failure",
				msg: "User credentials not found"});
		}
		else{
			const userPasswordHash = searchCredentialsResult.password;
			const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);
			const userType = (isUserAdmin === true) ? "admin" : "local";
			/** If password hash matches */
			if(validatePassResult)
			{
				const accessToken = await TOKENIZER.generateAccessToken(userId, userEmail, userType);
				const refreshToken = await TOKENIZER.generateRefreshToken(userId, userEmail, userType);

				/** Change the login status by updating the refresh token. Any old session will be deleted. */
				await AUTH.updateLoginStatus(searchCredentialsResult._id, refreshToken);

				/** Checking if the user was already logged in from other device */
				if(searchCredentialsResult.refreshToken !== "")
				{
					/** Sending appropriate response by updating the frontend cookies */
					console.log("Login Controller : Deleted the old session".yellow);
					res
					.status(200)
					.cookie('accessToken', 	accessToken,	{ httpOnly: true, sameSite: "strict", secure: false})
					.cookie('refreshToken', refreshToken,	{ httpOnly: true, sameSite: "strict", secure: false})
					.send({
						status: "failure",
						msg: "Duplicate Session",
						userId: userId,
					});
				}
				else
				{
					/** If email is verified continue or else move to verification */
					if(searchUserResult.isEmailVerified === false){
						return res.status(200).send({
							status: "failure",
							msg: "Email not verified",
							userId: userId,
						});
					}
					else{
						/** For a fresh login, generate a new refresh token. */
						console.log("Login Controller : Clean Login".yellow);
						res
						.cookie('accessToken', 	accessToken,	{ httpOnly: true, sameSite: "strict", secure: false})
						.cookie('refreshToken', refreshToken,	{ httpOnly: true, sameSite: "strict", secure: false})
						.status(200)
						return res.status(200).send({
							status: "success",
							msg: "Logged in successfully",
							userId: userId,
						});
					}
				}
			}
			else{ /** If password has does not match */
				console.log("Login Controller: Incorrect Password provided".red);
				return res.status(404)
				.send({
					status: "failure",
					msg: "Incorrect Password"
				})
			}
		}
	}
}

module.exports = loginController;
