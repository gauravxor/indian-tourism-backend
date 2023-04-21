const bcrypt = require('bcrypt');

const AUTH		= require('../../helper/authHelper');
const OTP		= require('../../helper/otpHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const OtpModel		= require('../../models/otpModel');

const verifyToken	= require('../../middlewares/verifyToken');



const changePassword = async (req, res) => {
	const requestEmail = req.body.email;
	const requestPassword = req.body.password;
	const requestNewPassword = req.body.newPassword;

	/** Search if the user exists in the database */
	const searchUserResult = await AUTH.searchUser(requestEmail);

	if(searchUserResult === null){
		res.status(404).send({
			status: "failure",
			msg: "User not found"});
	}
	else
	{
		/** If user is found, search for their credentials */
		const userId = searchUserResult._id;
		const searchCredentialsResult = await AUTH.searchCredentials(userId);

		if(searchCredentialsResult === null)
			res.status(404).send({
				status: "failure",
				msg: "Something went wrong, user credentials not found"
			});
		else
		{
			/** If credentials are found, check if the user is logged in */
			if(searchCredentialsResult.refreshToken === "")
				res.status(404).send({
					status: "failure",
					msg: "User must be logged in to change password"
				});
			else
			{
				/** If user is logged in */
				const userPasswordHash = searchCredentialsResult.password;
				const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);
				/** If old password is valid */
				if(validatePassResult)
				{
					const newPasswordHash = await bcrypt.hash(requestNewPassword, 10);
					const updatePasswordResult = await AUTH.updatePassword(searchCredentialsResult._id, newPasswordHash);
					if(updatePasswordResult)
						res.status(200).send({
							status: "success",
							msg: "Password updated successfully!"
						});
					else
						res.status(500).send({
							status: "failure",
							msg: "Failed to update password"
						});
				}
				else{
					res.status(200).send({
						status: "failure",
						msg: "Invalid current password"
					});
				}
			}
		}
	}
}


/**
 * WORKING
 * User clicks forgot password button and enters their email id which is then sent to the server for
 * verification. If the user exists, then an otp is sent to the user's email id.
 * The sever returns a success message to the client along with an access token and a refresh token.
 *
 * The client will display an box to enter the otp. Which will be sent to server using "verify-otp" route.
 * After veritification, the client will display a box to enter the new password. Which will be sent to
 * server using "change-password" route.
 */

const forgotPassword = async (req, res, next) => {

	const requestEmail = req.body.email;

	/** Search if the user exists in the database */
	const searchUserResult = await AUTH.searchUser(requestEmail);

	if(searchUserResult === null)
		res.status(404).send({
			status: "failure",
			msg: "Wrong email id or user doesnot exist"
		});
	else /** If the request body has cookies then the user is trying to send a new password */
	if(JSON.stringify(req.cookies) !== '{}' && req.cookies.accessToken !== "" && req.cookies.refreshToken !== "")
	{
		console.log("Inside forgot password controller middle else".yellow);

		/** Searching if any OTP for the User exists in database */
		const otpSearchResult = await OtpModel.findOne({
			emailId: requestEmail,
			otpType: "passwordReset"
		});

		/**
		 * To let the user change the password, the password reset OTP must be validated.
		 *  If the OTP is not validated, then the user must first validate the OTP.
		**/

		if(otpSearchResult === null)
			return res.status(404).send({msg: "OTP not found"});
		else
		if(otpSearchResult.isResetOtpValidated === false)
			return res.status(200).send({msg: "Otp not yet verified"});
		else
		if(otpSearchResult.isResetOtpValidated === true)
		{
			console.log("Password reset OTP verified".green);
			console.log("Validating acess tokens".yellow);
			console.log("Some Cookies found".red);
			console.log(req.cookies);

			/** The received tokens through cookies must be validated */
			await verifyToken(req, res);

			console.log("Access token validated".green);

			const requestNewPassword = req.body.newPassword;
			const newPasswordHash = await bcrypt.hash(requestNewPassword, 10);
			const searchCredentialsResult = await AUTH.searchCredentials(searchUserResult._id);
			const updatePasswordResult = await AUTH.updatePassword(searchCredentialsResult._id, newPasswordHash);

			if(updatePasswordResult)
			{
				console.log("Deleting OTP collection".yellow);
				var otpDocumentId = (otpSearchResult._id).toString();
				await OtpModel.findByIdAndDelete(otpDocumentId);
				console.log("Otp collection deleted".green);
				await AUTH.updateLoginStatus(searchCredentialsResult._id, "");

				res
				.clearCookie('accessToken')
				.clearCookie('refreshToken')
				.status(200)
				.send({
					status: "success",
					msg: "Password changed successfully! User your new password to login"
				});
			}
			else
				res.status(500).send({
					status: "failure",
					msg: "Password update failed"
				});
		}
	}
	else /** If the request body has no cookies then the user is trying to send an otp */
	{
		console.log("User found, sending otp to the user's email".green);

		const userId = searchUserResult._id;

		/** For security reason we are not using the "requestEmail" data */
		const userEmail = searchUserResult.contact.email;

		const sendPasswordResetEmailResult = await OTP.sendPasswordResetEmail(userEmail, userId);

		/** If email was sent successfully, send out Tokens */
		if(sendPasswordResetEmailResult !== null)
		{
			const authToken 	= await TOKENIZER.generateAccessToken(userId, userEmail);
			const refreshToken 	= await TOKENIZER.generateRefreshToken(userId, userEmail);
			console.log("Tokens generated".green);

			/** Save the refresh token in a database */
			const searchCredentialsResult = await AUTH.searchCredentials(userId);
			const updateLoginStatusResult = await AUTH.updateLoginStatus(searchCredentialsResult._id, refreshToken);

			if(updateLoginStatusResult){
				console.log("Refresh token saved in the database".green);
				res
				.cookie('accessToken', authToken, { httpOnly: true, SameSite: true, secure: true})
				.cookie('refreshToken', refreshToken, { httpOnly: true, SameSite: true, secure: true})
				.status(200)
				.send({
					status: "success",
					msg: "Password reset email sent",
					otp: sendPasswordResetEmailResult
				});
			}
			else{
				res.status(500).send({
					status: "failure",
					msg: "Failed to update login status"
				});
			}
			// at this point, the user has to enter the otp sent to their email
			// SETUP TO BE DONE FOR THAT IN FRONTEND.
		}
		else{
			res.status(500).send({
				status: "failure",
				msg: "Password reset email failed"
			});
		}
	}
}

module.exports = {
	changePassword,
	forgotPassword
}
