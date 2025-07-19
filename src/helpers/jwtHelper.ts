import jwt from "jsonwebtoken";
/**
 *  The Access and Refresh Tokens have the following payloads
 *  1. User's Document ID
 *  2. User's Email ID
 *  3. User's Type (Local/Admin)
 *  4. Expiry Time
 */

/* Function to generate User Access Token */
function generateAccessToken(
    userDocumentId: string,
    userEmail: string,
    userType: string
): string {
    const accessPayload = {
        userId: userDocumentId,
        userEmail: userEmail,
        userType: userType,
    };
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    const accessToken = jwt.sign(
        accessPayload,
        accessSecret /* JWT Access Secret */,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRY,
        } /* Access token expiry Time */
    );

    return accessToken;
}

function generateRefreshToken(
    userDocumentId: string,
    userEmail: string,
    userType: string
): string {
    const refreshPayload = {
        userId: userDocumentId,
        userEmail: userEmail,
        userType: userType,
    };

    const refreshSecret = process.env.JWT_ACCESS_SECRET;
    if (!refreshSecret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    const refreshToken = jwt.sign(
        refreshPayload,
        refreshSecret /* JWT Refresh Secret */,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY,
        } /* Refresh token expiry Time */
    );

    return refreshToken;
}

export { generateAccessToken, generateRefreshToken };
