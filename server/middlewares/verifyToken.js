const jwt = require('jsonwebtoken');
const Tokeniser = require('../helper/jwtHelper')
const Auth = require('../helper/authHelper');
function verifyToken(req, res, next) {
	console.log("In token verificatio middleware".bgYellow);

	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	console.log("The access token = " + accessToken);
	console.log("The refresh token = " + refreshToken);


	if(accessToken == null && refreshToken == null)
		return res.status(401).send({msg: "Token not found"});
	else
	{
		// getting the payload of JWT tokens
		accessTokenPayload = jwt.decode(accessToken);
		refreshTokenPayload = jwt.decode(refreshToken);

		// checking if the email in the payload matches the email in the request body
		// if not, then it is a malicious attempt
		console.log("Access token email = " + accessTokenPayload.userEmail);
		console.log("Refresh token email = " + refreshTokenPayload.userEmail);

		console.log("Client side email = " + req.body.email);
		if(accessTokenPayload.userEmail !== req.body.email || refreshTokenPayload.userEmail !== req.body.email)
			return res.status(403).send({msg: "Malicious Attempt"});
		else
		{
			jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET , (err, user) => {
				if(err){
					console.log("Access token expired".bgYellow);
					jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
						if(err){
							console.log("Refresh token expired".bgYellow);
							res
							.clearCookie('accessToken')
							.clearCookie('refreshToken')

							// as refresh token is expired, we need to update the user's login status in the database.

							const userId = accessTokenPayload.userId;
							const credentialsSearchResult = await Auth.searchCredentials(userId);
							const updateQueryResult = await Auth.updateLoginStatus(credentialsSearchResult._id, false);
							if(updateQueryResult !== null)
								return res.status(201).send({
									msg: "Token expired, logging out, please login again to continue"
							});
						}
						else{
							console.log("Generating new access token".bgYellow);
							// generating a new access token and sending it to the client
							const userId = accessTokenPayload.userId;
							const userEmail = accessTokenPayload.userEmail;
							const newAccessToken = Tokeniser.generateAccessToken(userId, userEmail);
							res.cookie('accessToken', newAccessToken, {httpOnly: true});
							console.log(user);
							// req.userId = user.userId;
							next();
						}
					});
				}
				else{
					console.log(user);
					req.userId = user.userId;
					next();
				}
			});
		}
	}
}


module.exports = verifyToken;