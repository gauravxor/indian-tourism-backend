const nodemailer = require('nodemailer');
const jwt 	     = require('jsonwebtoken');
const colors     = require('colors');

const AUTH = require('./authHelper');
const OtpModel	= require('../models/otpModel');
const UserModel	= require('../models/userModel');
const { Console } = require('console');

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
	console.log("OTP Helper : User Id is -> ".yellow + `${userDocumentId}`.cyan);
	console.log("OTP Helper : Starting to save otp".yellow);
	const OtpDocument = new OtpModel({
		userId: userDocumentId,
		emailId: userEmail,
		otp: generatedOtp,
		otpType: otpType,
		createdAt: Date.now(),
	});

	const saveOtpResult = await OtpDocument.save();
	if(saveOtpResult === null){
		console.log("OTP Helper : Error saving OTP to database".red);
	}
	else{
		console.log("OTP Helper : Saved OTP data in DB".green);
	}
}

/** Function to send OTP to userEmail for Email Verification */
async function emailOtp(userEmail, userDocumentId)
{
	const otp = generateOtp(8);
	console.log("OTP Helper : Generated OTP -> ".yellow + `${otp}`.cyan);

	console.log("OTP Helper : Saving OTP to database".yellow);
	await saveOtp(otp, userEmail, userDocumentId, "emailVerification");

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
		subject: "OTP for Email Verification - Indian Tourism",
		html: `
			<div style="background-color:#f2f2f2; padding: 20px;">
				<div style="background-color:white; padding: 20px;">
					<h2 style="color:#007bff; font-family:Arial, sans-serif;">Indian Tourism</h2>
					<p style="font-size:16px; font-family:Arial, sans-serif;">Thank you for registering with Indian Tourism. Please enter the following One-Time Password (OTP) to verify your email address:</p>
					<div style="background-color:#007bff; color:white; padding:10px 20px; display:inline-block; font-size:20px; font-family:Arial, sans-serif;">${otp}</div>
					<p style="font-size:16px; font-family:Arial, sans-serif;">Please enter this OTP within 5 minutes to complete the verification process.</p>
				</div>
				<p style="font-size:12px; color:#666666; font-family:Arial, sans-serif;">This email was sent from Indian Tourism.</p>
			</div>
		`
	};

	console.log("OTP Helper: Sending the OTP email".yellow)
	await transporter.sendMail(mailData);
	console.log("OTP Helper : Otp " + `${otp}`.blue + " sent to ".yellow + `${userEmail}`.blue)
	// return otp;
}


/** Function to send OTP to userEmail for Password Reset */
async function sendPasswordResetEmail(userEmail, userDocumentId)
{
	const otp = generateOtp(8);
	console.log("OTP Helper : Generated OTP -> ".yellow + `${otp}`.cyan);

	console.log("OTP Helper : Saving OTP in DB".yellow);
	await saveOtp(otp, userEmail, userDocumentId, "passwordReset");

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

	console.log("OTP Helper : Sending password reset email".yellow)
	await transporter.sendMail(mailData);
	console.log("OTP Helper : Otp " + `${otp}`.blue + " sent to ".yellow + `${userEmail}`.blue)
}

/** Function to check if OTP is expired or not */
function isOtpExpired(otpCreationTime)
{
	/** Validity of OTP is 5 minutes */
	const timeCreated = (new Date(otpCreationTime)).getTime();
	const timeNow = (new Date()).getTime();
	const timeDifference = timeNow - timeCreated;
	console.log("OTP Helper : Time (in ms) since OTP creation -> ".yellow + `${timeDifference}`.cyan);
	return (timeDifference > (50 * 60 * 1000));
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
			console.log("OTP Helper : OTP Validated".green)
			documentId = (searchOtpResult._id).toString();

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
	else{  /** If OTP does not matches */
		return "otpError";
	}
}

/** Function to resend OTP. It handles both email verification and password reset */
async function resendOtp(req, res){

	const requestEmail = req.body.email;
	const userData = await AUTH.searchUser(requestEmail)
	const userId = userData._id;
	const requestOtpType = req.body.otpType;

	console.log("OTP Helper : Re-sending OTP for ".yellow + `${requestOtpType}`.cyan);

	var otp = 0;
	if(requestOtpType === "emailVerification"){
		otp = await emailOtp(requestEmail, userId);
		return res.status(200)
		.json({
			status: "success",
			msg: "Otp for sent for email verification",
			otp: otp
		});
	}
	else
	if(requestOtpType === "passwordReset"){
		otp = await sendPasswordResetEmail(requestEmail, userId);
		return res.status(200)
		.json({
			status: "success",
			msg: "Otp for sent for password reset",
			otp: otp
		});
	}
	else{
		return res.stauts(400)
		.json({
			status: "failure",
			msg: "Invalid request"
		})
	}
}

module.exports = {
	emailOtp,
	verifyOtp,
	resendOtp,
	sendPasswordResetEmail
};