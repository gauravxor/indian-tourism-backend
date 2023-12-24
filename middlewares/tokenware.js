const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../helper/jwtHelper');

function checkCookies(req) {
    if (JSON.stringify(req.cookies) === '{}' || req.cookies.accessToken === undefined) {
        console.log('VerifyToken : No cookies were provided'.red);
        return false;
    }
    return true;
}

function verifyAccessToken(req, res, next) {
    if (!checkCookies(req, res, next)) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'missing token',
                details: 'access token was not recevied with the request',
            },
        });
    }

    /** Checking if Access Token is valid */
    const accessToken = req.cookies.accessToken;
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (error, payload) => {
        if (error) {
            console.log('VerifyToken : Access token expired'.yellow);
            return res.status(401).json({
                status: 'failure',
                code: 401,
                error: {
                    message: 'tokens expired',
                    details: 'expired access tokens provided',
                },
            });
        }
        /** Setting the user id & type, to be used by next controller */
        req.userId = payload.userId;
        req.userType = payload.userType;
        req.userEmail = payload.userEmail;
        next();
    });
}

function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'missing token',
                details: 'refresh token was not recevied with the request',
            },
        });
    }
    /** Checking if Refresh Token is valid */
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (error, payload) => {
        if (error) {
            console.log('VerifyToken : Refresh token expired'.yellow);
            return res.status(401).json({
                status: 'failure',
                code: 401,
                error: {
                    message: 'tokens expired',
                    details: 'expired refresh tokens provided',
                },
            });
        }

        /** If Refresh Token is valid, then generate new Access Token */
        const { userId, userEmail, userType } = payload;
        const newAccessToken = generateAccessToken(userId, userEmail, userType);
        const newRefreshToken = generateRefreshToken(userId, userEmail, userType);
        res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'tokens generated',
                refreshToken: newRefreshToken,
            },
        });
    });
}

function getAccessTokenExpiryEpoch(req, res) {
    console.log('Getting access token expiry epoch'.yellow);
    if (!checkCookies(req)) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'missing token',
                details: 'access token was not recevied with the request',
            },
        });
    }
    console.log('Got cookies');
    const accessToken = req.cookies.accessToken;
    const { exp: accessTokenExpiryEpoch } = jwt.decode(accessToken);
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'received access token expiry epoch',
            details: 'got access token expiry epoch in seconds',
            accessTokenExpiryEpoch,
        },
    });
}

module.exports = {
    verifyAccessToken,
    refreshAccessToken,
    getAccessTokenExpiryEpoch,
};
