import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "@helpers/jwtHelper";
import { Request, Response, NextFunction } from "express";
import { apiResponse, apiError } from "@utils/responseHelper";

interface AuthenticationRequest extends Request {
    userId?: string;
    userType?: string;
    userEmail?: string;
}

function checkCookies(req: Request): boolean {
    return !(
        JSON.stringify(req.cookies) === "{}" ||
        req.cookies.accessToken === undefined
    );
}

function verifyAccessToken(
    req: AuthenticationRequest,
    res: Response,
    next: NextFunction
) {
    if (!checkCookies(req)) {
        console.log("VerifyToken : No cookies were provided");
        return apiError(res, 401, "missing access token");
    }

    const accessToken = req.cookies.accessToken;
    try {
        const payload = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload;

        req.userId = payload.userId as string;
        req.userType = payload.userType as string;
        req.userEmail = payload.userEmail as string;
        next();
    } catch (error) {
        console.log("VerifyToken : Access token expired or invalid");
        return apiError(res, 401, "access token expired");
    }
}

function refreshAccessToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            status: "failure",
            code: 401,
            error: {
                message: "missing token",
                details: "refresh token was not received with the request",
            },
        });
    }

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as JwtPayload;

        const { userId, userEmail, userType } = payload;
        const newAccessToken = generateAccessToken(
            userId as string,
            userEmail as string,
            userType as string
        );
        const newRefreshToken = generateRefreshToken(
            userId as string,
            userEmail as string,
            userType as string
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        return apiResponse(res, 200, "access tokens refreshed", {
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.log("VerifyToken : Refresh token expired or invalid");
        return res.status(401).json({
            status: "failure",
            code: 401,
            error: {
                message: "tokens expired",
                details: "expired or invalid refresh token provided",
            },
        });
    }
}

function getAccessTokenExpiryEpoch(req: Request, res: Response): Response {
    if (!checkCookies(req)) {
        console.log("Access token not present");
        return apiError(res, 401, "access token not present");
    }

    const accessToken = req.cookies.accessToken;
    const decoded = jwt.decode(accessToken) as JwtPayload | null;

    return apiResponse(res, 200, "received access token expiry epoch", {
        epoch: decoded?.exp,
    });
}

export {
    verifyAccessToken,
    refreshAccessToken,
    getAccessTokenExpiryEpoch,
    AuthenticationRequest,
};
