const OTP = require('../../helper/otpHelper');
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');
const color = require('colors');

const otpController = async (req, res) => {

	const requestOtpType = req.body.otpType;
	const requestEmail	 = req.body.email;
	const requestOtp	 = req.body.otp;

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
			return res.status(200).send({
					status: "failure",
					msg: "OTP expired or invalid otp"
			});
		}
		else
		if(verifyOtpResult === "emailVerified" || verifyOtpResult === "otpValidated"){

			const userSearchResult = await AUTH.searchUser(requestEmail);
			if(userSearchResult === null){
				return res.status(404).send({
					status: "failure",
					msg: "User not found"
				});
			}
			const userId = (userSearchResult._id).toString();
			const accessToken = await TOKENIZER.generateAccessToken(userId, requestEmail, "local");
			const refreshToken = await TOKENIZER.generateRefreshToken(userId, requestEmail, "local");
			const message = (verifyOtpResult === "emailVerified") ? "Email verified successfully" : "OTP validated successfully";

			const searchCredentialsResult = await AUTH.searchCredentials(userId);
			const updateLoginStatusResult = AUTH.updateLoginStatus(searchCredentialsResult._id, refreshToken);
			if(updateLoginStatusResult === null){
				console.log("OTP Controller: Error in updating login status".red);
				return res.status(404).send({
					status: "failure",
					msg: "Error in updating login status"
				});
			}
			return res
			.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", secure: true})
			.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "strict", secure: true})
			.status(200).json({
				status: "success",
				msg: message,
			});
		}
	}
};

module.exports = otpController;
