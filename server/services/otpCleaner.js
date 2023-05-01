const OtpModel = require('../models/otpModel');

const otpCleaner = async () => {


	const otpData = await OtpModel.find({});
	if(JSON.stringify(otpData) === JSON.stringify([])) {
		console.log("OTP Cleaner : No OTP data found".green);
	}
	else{
		otpData.forEach(async (otp) => {
			const currentTime = new Date();
			const otpTime = otp.createdAt;

			const diff = currentTime - otpTime;
			const diffInMinutes = diff / 1000;
			console.log("The time difference " + diffInMinutes);
			if(diffInMinutes > 150) {
				console.log("OTP Cleaner : Deleting expired OTP".yellow);
				const deleteOtpResult = await OtpModel.deleteOne({ email: otp.email });
				if(deleteOtpResult === null) {
					console.log("OTP Cleaner : Error deleting OTP data".red);
				}
			}
		});
	}
}

module.exports = otpCleaner;
