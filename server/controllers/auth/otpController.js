const OTP = require('../../helper/otpHelper');

const otpController = async (req, res) => {

	const requestOtpType = req.body.otpType;
	const requestEmail	 = req.body.email;
	const requestOtp	 = req.body.otp;

	console.log("Request email = "+ requestEmail.yellow);
	console.log("Request otp = "+ requestOtp.yellow);
	console.log("Request otp type = "+ requestOtpType.yellow);
	console.log("email = "+ requestEmail);

	if(requestEmail === null){
		return res.status(400).send({
			status: "failure",
			msg: "Email is required"
		});
	}
	else
	{
		const verifyOtpResult = await OTP.verifyOtp(requestEmail, requestOtp, requestOtpType);
		console.log("The returned result is = "+ verifyOtpResult);

		if(verifyOtpResult === "emailError"){
			return res.status(200).send({
				status: "failure",
				msg: "User not found or invalid email"
			});
		}
		else
		if(verifyOtpResult === "otpError"){
				res.status(200).send({
					status: "failure",
					msg: "OTP expired or invalid otp"
			});
		}
		else
		if(verifyOtpResult === "emailVerified"){
			res.status(200).send({
				status: "success",
				msg: "Email verified successfully"
			});
		}
		else
		if(verifyOtpResult === "otpValidated"){
			res.status(200).send({
				status: "success",
				msg: "OTP validated successfully"
			});
		}
	}
};

module.exports = otpController;
