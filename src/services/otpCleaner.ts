import { OtpModel } from "@models/otp";

const otpCleaner = async (): Promise<void> => {
    const otpData = await OtpModel.find({});

    if (otpData.length > 0) {
        for (const otp of otpData) {
            const currentTime = new Date().getTime();
            const otpTime = new Date(otp.createdAt).getTime();

            const diffInSeconds = (currentTime - otpTime) / 1000;

            if (
                (diffInSeconds > 150 && otp.otpType === "emailVerification") ||
                (diffInSeconds > 300 && otp.otpType === "passwordReset")
            ) {
                console.log("OTP Cleaner: Expired OTP found");
                try {
                    const deleteOtpResult = await OtpModel.deleteOne({
                        email: otp.emailId,
                    });
                    if (deleteOtpResult.deletedCount === 0) {
                        console.log("OTP Cleaner: No OTP deleted");
                    } else {
                        console.log("OTP Cleaner: Expired OTP deleted");
                    }
                } catch (err) {
                    console.log("OTP Cleaner: Error deleting OTP", err);
                }
            }
        }
    }
};

export default otpCleaner;
