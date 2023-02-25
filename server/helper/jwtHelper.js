const jwt = require("jsonwebtoken");


// helper function to generate JWT token
function generateAccessToken(userId, userEmail){
	const accessToken = jwt.sign(
		{userId, userEmail},  // JWT payload
		process.env.JWT_ACCESS_SECRET,  // secret
		{expiresIn: process.env.JWT_ACCESS_EXPIRY}  // expiry
	);
	return accessToken;
}

function generateRefreshToken(userId, userEmail){
	const refreshToken = jwt.sign(
		{userId, userEmail},    // JWT payload
		process.env.JWT_REFRESH_SECRET,  // secret
		{expiresIn: process.env.JWT_REFRESH_EXPIRY} // expiry
	);
	return refreshToken;
}


module.exports = {
	generateAccessToken,
	generateRefreshToken,
}
