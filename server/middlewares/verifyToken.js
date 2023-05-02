const jwt = require('jsonwebtoken');

const TOKENIZER = require('../helper/jwtHelper')
const AUTH 		= require('../helper/authHelper');

const { ObjectId } = require('mongodb');

async function verifyToken(req, res, next) {

	if(JSON.stringify(req.cookies) === '{}') {
		console.log("VerifyToken : No cookies were provided".red);
		return res.status(401).send({
			msg: "Unauthorized access"
		});
	}

	/** Getting tokens from Cookies */
	const requestAccessToken = req.cookies.accessToken;
	const requestRefreshToken = req.cookies.refreshToken;

	/** Checking if the request has proper Access and Refresh Tokens */
	if(requestAccessToken === "" || requestRefreshToken === ""){
		console.log("VerifyToken : Received cookies does not contain any tokes".bgRed);
		return res.status(401).send({
			msg: "Unauthorized access"
		});
	}

	/** Decoding Token's Payload Data */
	accessTokenPayload = jwt.decode(requestAccessToken);
	refreshTokenPayload = jwt.decode(requestRefreshToken);

	/** Getting userId from access token payload */
	const accessTokenPayloadUserId = accessTokenPayload.userId;

	/** Getting userType from access token payload */
	const userType = accessTokenPayload.userType;
	console.log("VerifyToken : User Type: ".yellow + userType);

	const credentialsSearchResult = await AUTH.searchCredentials(accessTokenPayloadUserId);

	/** Checking if  a MITM is trying to modify the credentials */
	if(credentialsSearchResult === null){
		console.log("VerifyToken : Malicious request. Received a modified payload".red)
		return res.status(404).send({
			msg: "Malicious request. Received a modified payload"
		});
	}
	else
	{
		/** Whatever operation user performs, if he is sending Tokens, he must be logged in */
		const existingRefreshToken = credentialsSearchResult.refreshToken;

		/** Checking if the user is logged in or not */
		if(existingRefreshToken === ""){
			console.log("VerifyToken : User Not Logged In".yellow)
			return res.status(401).send({
				status: "failure",
				msg: "User Not Loggen In. Please Login to continue"
			});
		}
		else
		/** Checking if the user is logged in from another device or not */
		if(existingRefreshToken !== "" && existingRefreshToken !== requestRefreshToken){
			console.log("VerifyToken : Logged in from other device".yellow)
			return res.status(401).send({
				status: "failure",
				msg: "User logged in from another device."
			});
		}
		else
		{
			const accessTokenPayloadEmail = accessTokenPayload.userEmail;
			const refreshTokenPayloadEmail = refreshTokenPayload.userEmail;
			var requestEmail = req.body.email;

			/** Temporary fix for multer (how to use multer here for request processing) */
			if(requestEmail === undefined){
				const _id = new ObjectId(credentialsSearchResult.userId);
				let userSearchResult = await AUTH.searchUserById(_id);
				if(userSearchResult === null)
					userSearchResult = await AUTH.searchAdminUserById(_id);
				requestEmail = userSearchResult.contact.email;
			}


			/** If email in request body does not matches the email in payload of Tokens */
			if(accessTokenPayloadEmail !== requestEmail || refreshTokenPayloadEmail !== requestEmail){
				return res.status(403).send({
					status: "failure",
					msg: "Malicious Attempt"
				});
			}
			else  /** If request email matches the token payload emails */
			{
				console.log("VerifyToken : Token Payload email matched".yellow);

				/** Checking if Access Token is valid */
				jwt.verify(requestAccessToken, process.env.JWT_ACCESS_SECRET , (err, user) => {
					if(err) /** If Access Token is Expired */
					{
						console.log("VerifyToken : Access token expired".yellow);

						/** Checking if Refresh Token is valid */
						jwt.verify(requestRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
							if(err) /** If Refresh Token is also expired */
							{
								console.log("VerifyToken : Refresh token expired".yellow);
								/** Since both tokens are expired, logout the user by clearing the cookies */
								res
								.clearCookie('accessToken')
								.clearCookie('refreshToken')

								/** Update the User's login status in database */
								const credentialDocumentId = credentialsSearchResult._id;
								const updateLoginStatus = await AUTH.updateLoginStatus(credentialDocumentId, "");
								if(updateLoginStatus !== null){
									console.log("VerifyToken : All tokens expired, logging out...".yellow);
									return res.status(201).send({
										status: "failure",
										msg: "Token expired, logging out, please login again to continue"
									});
								}
							}
							else /** If Refresh Token is not expired */
							{
								/** Use the Refresh Token to generate a new Access Token */
								console.log("VerifyToken : Generating new access token".yellow);

								/** Getting the user's id and email from Tokens */
								const refreshTokenPayloadUserId = refreshTokenPayload.userId;
								const userEmail = refreshTokenPayload.userEmail;

								/** Generating new Access Token */
								const newAccessToken = TOKENIZER.generateAccessToken(refreshTokenPayloadUserId, userEmail, userType);

								/** Sending out a new Access Token to the user */
								res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: "strict", secure: true});

								/** Sending the user to the next middleware */
								if(next === undefined)
									return true;

								/** Sending user data to next middleware */
								req.userId = credentialsSearchResult.userId;
								req.userEmail = credentialsSearchResult.userEmail;
								req.userType = userType;

								next();
							}
						});
					}
					else /** If Access Token is not expired */
					{
						console.log("VerifyToken : Access token not expired. Continuing...".yellow);

						/** Sending userId to next middleware */
						req.userId = credentialsSearchResult.userId;
						req.userEmail = accessTokenPayloadEmail;
						req.userType = userType;

						if(next === undefined)
							return true;
						next();
					}
				});
			}
		}
	}
}

module.exports = verifyToken;