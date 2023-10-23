const OtpModel = require('../models/otpModel');

const otpCleaner = async () => {


    const otpData = await OtpModel.find({});

    /** If lock OTP collection is not empty */
    if (!(JSON.stringify(otpData) === JSON.stringify([]))) {
        otpData.forEach(async (otp) => {
            const currentTime = new Date();
            const otpTime = otp.createdAt;

            const diff = currentTime - otpTime;
            const diffInMinutes = diff / 1000;
            if ((diffInMinutes > 150 && otp.otpType === "emailVerification") || (diffInMinutes > 300 && otp.otpType === "passwordReset")) {
                console.log("OTP Cleaner : Expired OTPs found".yellow);
                const deleteOtpResult = await OtpModel.deleteOne({ email: otp.email });
                if (deleteOtpResult === null) {
                    console.log("OTP Cleaner : Error deleting expired OTP data".red);
                }
                else {
                    console.log("OTP Cleaner : Expired OTP data deleted".green)
                }
            }
        });
    }
}

module.exports = otpCleaner;
