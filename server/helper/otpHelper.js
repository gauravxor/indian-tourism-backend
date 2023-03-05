const nodemailer = require('nodemailer');
const jwt 	     = require('jsonwebtoken');

const OtpModel	= require('../models/otpModel');
const UserModel	= require('../models/userModel');

/** Function to generate OTP */
function generateOtp(length)
{
	let otp = '';
	var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = 0; i <= length; i++ )
		otp += digits[Math.floor(Math.random() * 36)];
	return otp;
}

/** Function to save the generated OTP in OTP Collection for email verification. */
async function saveOtp(generatedOtp, userEmail, userDocumentId, otpType)
{
	/** If any old OTP exists in the database, delete it */
	await OtpModel.deleteOne({emailId: userEmail, userId: userDocumentId});

	console.log("Starting to save otp".green);
	const OtpDocument = new OtpModel({
		userId: userDocumentId,
		emailId: userEmail,
		otp: generatedOtp,
		otpType: otpType,
		createdAt: Date.now(),
	});

	const saveOtpResult = await OtpDocument.save();
	console.log(saveOtpResult);
	console.log("Done saving otp".green);
}

/** Function to send OTP to userEmail for Email Verification */
async function emailOtp(userEmail, userDocumentId)
{
	console.log("Generating OTP".green);
	const otp = generateOtp(8);
	console.log("Generated OTP: ".green + `${otp}`.blue);

	console.log("Saving OTP to database".green);
	const saveOtpResult = await saveOtp(otp, userEmail, userDocumentId, "emailVerification");
	// console.log(saveOtpResult);
	console.log("Saved OTP to database".green);

	/** Creating the nodemailer object */
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		}
	});

	/** Creating the mail body object */
	const mailData = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "OTP for Email verification",
		text: 'Your OTP is ' + otp,
	};

	console.log("Sending the email".green)
	await transporter.sendMail(mailData);
	console.log("Otp " + `${otp}`.blue + " sent to " + `${userEmail}`.blue)
	// return otp;
}


/** Function to send OTP to userEmail for Password Reset */
async function sendPasswordResetEmail(userEmail, userDocumentId)
{
	console.log("Generating OTP".green);
	const otp = generateOtp(8);
	console.log("Generated OTP: ".green + `${otp}`.blue);

	console.log("Saving OTP to database".green);
	const saveOtpResult = await saveOtp(otp, userEmail, userDocumentId, "passwordReset");
	// console.log(saveOtpResult);
	console.log("Saved OTP to database".green);


	/** Creating the nodemailer object */
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		}
	});

	/** Creating the mail body object */
	const mailData = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "OTP for password reset",
		text: 'Your OTP is ' + otp,
	};

	console.log("sending the email".green)
	const transportResult = await transporter.sendMail(mailData);
	console.log("Otp " + `${otp}`.blue + " sent to " + `${userEmail}`.blue)
	// return otp;
}

/** Function to check if OTP is expired or not */
function isOtpExpired(otpCreationTime)
{
	const timeCreated = (new Date(otpCreationTime)).getTime();
	const timeNow = (new Date()).getTime();
	return ((timeNow - timeCreated) > (5 * 60 * 1000));
}


/** Function to verify OTP (both for email veritifactiona & password reset) */
async function verifyOtp(userEmail, otp, otpType)
{
	const searchOtpResult = await OtpModel.findOne({
		emailId: userEmail,
		otpType: otpType,
	});

	/* If no OTP is found in the database */
	if(searchOtpResult === null)
		return "emailError";
	else /* If any OTP data is found, check if it is equal to the User's Entered OTP */
	if(searchOtpResult.otp === otp)
	{
		/* If OTP is expired, return error */
		if(isOtpExpired(searchOtpResult.createdAt) === true)
			return "otpError";
		else
		{
			console.log("Otp Validated".green)
			documentId = (searchOtpResult._id).toString();
			console.log(documentId);

			/* If OTP is for email verification, update the user's emailVerified field to true and delete OTP Document*/
			if(otpType === "emailVerification")
			{
				await UserModel.findByIdAndUpdate(searchOtpResult.userId, {
					isEmailVerified: true
				});
				await OtpModel.findByIdAndDelete(documentId);
				return "emailVerified";
			}
			/**
			 * If OTP is for password reset, update the user's isResetOtpValidated field to true.
			 * We don't delete the OTP Document as the final step of Updating the password is yet to
			 * be done and we can only delete that after the password is updated.
			**/
			if(otpType === "passwordReset")
			{
				await OtpModel.findOneAndUpdate(searchOtpResult.userId, {
					isResetOtpValidated: true
				});
				return "otpValidated";
			}
		}
	}
	else  /** If OTP does not matches */
		return "otpError";
}

/** Function to resend OTP. It handles both email verification and password reset */
async function resendOtp(req, res){
	console.log(req.cookies);
	/** If cookies are not present, return error */
	if(req.cookies === undefined){
		console.log("Cookies not sent with request".red);

		res
		.status(401)
		.send({
			msg: "Unauthorized"
		});
	}

	const accessToken = req.cookies.accessToken;
	const payloadUserId = (jwt.decode(accessToken)).userId;

	const requestEmail = req.body.email;
	const requestOtpType = req.body.otpType;

	console.log("The OTP type is: ".green + `${requestOtpType}`.blue);

	var otp = 0;
	if(requestOtpType === "emailVerification"){
		otp = await emailOtp(requestEmail, payloadUserId);
		res
		.status(200)
		.send({
			msg: "Otp for sent for email verification",
			otp: otp
		});
	}
	else
	if(requestOtpType === "passwordReset"){
		otp = await sendPasswordResetEmail(requestEmail, payloadUserId);
		res
		.status(200)
		.send({
			msg: "Otp for sent for password reset",
			otp: otp
		});
	}
}

module.exports = {
	emailOtp,
	verifyOtp,
	resendOtp,
	sendPasswordResetEmail
};
