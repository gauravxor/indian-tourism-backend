const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../helper/jwtHelper');

function verifyAccessToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    /** If we don't receive any auth headers */
    if (!authorizationHeader) {
        return res.status(401).json({
            status: 'failure',
            msg: 'Unauthorized access',
        });
    }
    const [beader, accessToken] = authorizationHeader.split(' ');
    /** If auth headers does not have any access token */
    if (beader !== 'Bearer' || !accessToken) {
        return res.status(401).json({
            status: 'failure',
            msg: 'Invalid authorization headers',
        });
    }

    /** Checking if Access Token is valid */
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (error, payload) => {
        if (error) {
            console.log('VerifyToken : Access token expired'.yellow);
            return res.status(401).json({
                status: 'failure',
                msg: 'Access token expired',
            });
        }
        /** Setting the user's type, to be used by next controller */
        req.userType = payload.userType;
        next();
    });
}

function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            status: 'failure',
            msg: 'No refresh token provided',
        });
    }
    /** Checking if Refresh Token is valid */
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (error, payload) => {
        if (error) {
            console.log('VerifyToken : Refresh token expired'.yellow);
            return res.status(401).json({
                status: 'failure',
                msg: 'Refresh token expired',
            });
        }

        /** If Refresh Token is valid, then generate new Access Token */
        const { userId, userEmail, userType } = payload;
        const newAccessToken = generateAccessToken(userId, userEmail, userType);
        return res.status(200).json({
            status: 'success',
            msg: 'Access token generated',
            accessToken: newAccessToken,
        });
    });
}

module.exports = {
    verifyAccessToken,
    refreshAccessToken,
};
