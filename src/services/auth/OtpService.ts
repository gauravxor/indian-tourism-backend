import UserRepository from "@repositories/UserRepository";
import { OtpError, NotFoundError } from "@root/src/utils/errors";
import * as OTP from "@helpers/otpHelper";
import { Types } from "mongoose";

interface OtpVerificationResult {
    otpVerified: true;
    userId: Types.ObjectId;
}

class OtpService {
    static async verifyOtp(
        otp: string,
        email: string,
        otpType: string
    ): Promise<OtpVerificationResult> {
        /** Checking if the received email belong to any user */
        const userSearchResult = await UserRepository.searchUser(email);
        if (!userSearchResult) {
            throw new NotFoundError("User not found");
        }

        const verifyOtpResult = await OTP.verifyOtp(email, otp, otpType);
        if (verifyOtpResult === "otp expired") {
            throw new OtpError("Otp Expired");
        }
        if (verifyOtpResult === "invalid otp") {
            throw new OtpError("Invalid Otp");
        }

        return {
            otpVerified: true,
            userId: userSearchResult._id,
        };
    }
}

export default OtpService;
