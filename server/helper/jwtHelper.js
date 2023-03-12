const jwt = require("jsonwebtoken");

/**
 *  The Access and Refresh Tokens have the following payloads
 *  1. User's Document ID
 * 	2. User's Email ID
 * 	3. Expiry Time
 */

/* Function to generate User Access Token */
function generateAccessToken(userDocumentId, userEmail){

	const accessPayload = {
		userId: userDocumentId,
		userEmail
	};

	const accessToken = jwt.sign(
		accessPayload,
		process.env.JWT_ACCESS_SECRET,	/* JWT Access Secret */
		{expiresIn: process.env.JWT_ACCESS_EXPIRY}	/* Access token expiry Time */
	);

	return accessToken;
}

function generateRefreshToken(userDocumentId, userEmail){

	const refreshPayload = {
		userId: userDocumentId,
		userEmail: userEmail
	};

	const refreshToken = jwt.sign(
		refreshPayload,
		process.env.JWT_REFRESH_SECRET,  /* JWT Refresh Secret */
		{expiresIn: process.env.JWT_REFRESH_EXPIRY} /* Refresh token expiry Time */
	);

	return refreshToken;
}


module.exports = {
	generateAccessToken,
	generateRefreshToken,
}
