import { generateAccessToken, generateRefreshToken } from "@helpers/jwtHelper";
import OtpService from "@services/auth/OtpService";
import { OtpError } from "@utils/errors";

import { apiError, apiResponse } from "@utils/responseHelper";

import setCookie from "@utils/cookieHelper";
import { Request, Response } from "express";

const otpController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { otp, email, otpType } = req.body;

    /** Checking if email id is received with the request. */
    if (!email) {
        return apiError(res, 400, "email not received");
    }

    /** Checking if we received a valid otp type */
    if (otpType !== "emailVerification") {
        return apiError(res, 400, "invalid otp type");
    }

    try {
        const verificationResult = await OtpService.verifyOtp(
            otp,
            email,
            otpType
        );
        const userId = verificationResult.userId.toString();

        const accessToken = generateAccessToken(userId, email, "local");
        const refreshToken = generateRefreshToken(userId, email, "local");
        setCookie(res, "accessToken", accessToken);
        return apiResponse(res, 200, "otp verified", {
            refreshToken: refreshToken,
        });
    } catch (error) {
        if (error instanceof OtpError) {
            return apiError(res, 401, error.message, error.details);
        }

        return apiError(res, 500, "internal server error");
    }
};

export default otpController;
