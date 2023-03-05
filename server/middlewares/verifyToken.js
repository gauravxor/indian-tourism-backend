const jwt = require('jsonwebtoken');

const TOKENIZER = require('../helper/jwtHelper')
const AUTH 		= require('../helper/authHelper');


async function verifyToken(req, res, next) {
	console.log("In token verification middleware".bgYellow);

	if(JSON.stringify(req.cookies) === '{}') {
		return res.status(401).send({
			msg: "Unauthorized access"
		});
	}

	/** Getting tokens from Cookies */
	const requestAccessToken = req.cookies.accessToken;
	const requestRefreshToken = req.cookies.refreshToken;

	/** Checking if the request has proper Access and Refresh Tokens */
	if(requestAccessToken === "" || requestRefreshToken === ""){
		return res.status(401).send({
			msg: "Unauthorized access"
		});
	}

	/** Getting Token's Payload Data */
	accessTokenPayload = jwt.decode(requestAccessToken);
	refreshTokenPayload = jwt.decode(requestRefreshToken);

	/** Geting userId from access token payload */
	const accessTokenPayloadUserId = accessTokenPayload.userId;

	const credentialsSearchResult = await AUTH.searchCredentials(accessTokenPayloadUserId);

	/** Checking if the a man in the middle is trying to modify the credentials */
	if(credentialsSearchResult === null){
		return res.status(404).send({
			msg: "Malicious request. Credentials were tried to modify"
		});
	}
	else
	{
		/** Whatever operation user performs, if he is sending Tokens, he must be logged in */
		const existingRefreshToken = credentialsSearchResult.refreshToken;

		/** Checking if the user is logged in or not */
		if(existingRefreshToken === "")
			return res.status(401).send({msg: "User Not Loggen In. Please Login to continue"});
		else
		/** Checking if the user is logged in from another device or not */
		if(existingRefreshToken !== "" && existingRefreshToken !== requestRefreshToken){
			return res.status(401).send({
				msg: "User logged in from another device."
			});
		}
		else
		{
			const accessTokenPayloadEmail = accessTokenPayload.userEmail;
			const refreshTokenPayloadEmail = refreshTokenPayload.userEmail;

			const requestEmail = req.body.email;

			/** If email in request body does not matches the email in payload of Tokens */
			if(accessTokenPayloadEmail !== requestEmail || refreshTokenPayloadEmail !== requestEmail){
				return res.status(403).send({
					msg: "Malicious Attempt"
				});
			}
			else  /** If request email matches the token payload emails */
			{
				console.log("Token Payload email matched".bgYellow);

				/** Checking if Access Token is valid */
				jwt.verify(requestAccessToken, process.env.JWT_ACCESS_SECRET , (err, user) => {
					if(err) /** If Access Token is Expired */
					{
						console.log("Access token expired".bgYellow);

						/** Checking if Refresh Token is valid */
						jwt.verify(requestRefreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
							if(err) /** If Refresh Token is also expired */
							{
								console.log("Refresh token expired".bgYellow);
								/** Since both tokens are expired, logout the user by clearing the cookies */
								res
								.clearCookie('accessToken')
								.clearCookie('refreshToken')

								/** Update the User's login status in database */
								const credentialDocumentId = credentialsSearchResult._id;
								const updateLoginStatus = await AUTH.updateLoginStatus(credentialDocumentId, "");
								if(updateLoginStatus !== null)
									console.log("Tokens expired, logging out...".yellow);
									return res.status(201).send({
									msg: "Token expired, logging out, please login again to continue"
								});
							}
							else /** If Refresh Token is not expired */
							{
								/** Use the Refresh Token to generate a new Access Token */
								console.log("Generating new access token".bgYellow);

								/** Getting the user's id and email from Tokens */
								const refreshTokenPayloadUserId = refreshTokenPayload.userId;
								const userEmail = refreshTokenPayload.userEmail;

								/** Generating new Access Token */
								const newAccessToken = TOKENIZER.generateAccessToken(refreshTokenPayloadUserId, userEmail);

								/** Sending out a new Access Token to the user */
								res.cookie('accessToken', newAccessToken, {httpOnly: true});

								/** Sending the user to the next middleware */
								if(next === undefined)
									return true;
								next();
							}
						});
					}
					else /** If Access Token is not expired */
					{
						console.log("Access token not expired".bgYellow);
						req.userId = user.userId;  // ????
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