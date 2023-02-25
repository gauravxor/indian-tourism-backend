const nodemailer = require('nodemailer');
const Otp = require('../models/otpModel');
const { findOne } = require('../models/userModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

function generateOtp()
{
	let otp = '';
	var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = 0; i < 8; i++ )
		otp += digits[Math.floor(Math.random() * 36)];
	return otp;
}


async function saveOtp(otp, email, _id)
{
	console.log("Deleting previous otp".green);
	await Otp.deleteOne({emailId: email, userId: _id});
	console.log("Deleted previous otp".green);

	console.log("Starting to save otp".green);
	const otpDocument = new Otp({
		userId: _id,
		emailId: email,
		otp: otp,
		createdAt: Date.now(),
	});

	const optSaveResult = await otpDocument.save();
	console.log(optSaveResult);
	console.log("Done saving otp".green);
}


async function emailOtp(email, userId)
{
	console.log("Generating OTP".green);
	const otp = generateOtp();
	console.log("Generated OTP: ".green + `${otp}`.blue);

	console.log("Saving OTP to database".green);
	const saveOtpResult = await saveOtp(otp, email, userId);
	// console.log(saveOtpResult);
	console.log("Saved OTP to database".green);



	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		}
	});

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: 'OTP for email verification',
		text: 'Your OTP is ' + otp,
	};

	console.log("sending the email".green)
	const transportResult = await transporter.sendMail(mailOptions);
	// console.log(transportResult);
	console.log("Otp " + `${otp}`.blue + " sent to " + `${email}`.blue)
	return otp;
}


async function verifyOtp(userEmail, otp, res)
{
	const queryResult = await Otp.findOne({emailId: userEmail});
	if(queryResult === null)
		return "emailError";
	else
	if(queryResult.otp === otp)
	{
		const timeCreated = (new Date(queryResult.createdAt)).getTime();
		const timeNow = (new Date()).getTime();
		console.log("time difference = "+ (timeNow - timeCreated).toString());
		if((timeNow - timeCreated) > (5 * 60 * 1000))
			return "otpError";
		else
		{
			console.log("Otp Validated".green)
			documentId = (queryResult._id).toString();
			console.log(documentId);

			await User.findByIdAndUpdate(queryResult.userId, {isEmailVerified: true});
			await Otp.findByIdAndDelete(documentId);
			return "success";
		}
	}
	else
		return "otpError";
}


async function resendOtp(req, res){
	console.log(req.cookies);
	if(req.cookies == undefined){
		console.log("Something went wrong, Try again".red);
		res.send({
			msg: "Something went wrong, Try again"
		});
	}
	const accessToken = req.cookies.accessToken;
	const userId = (jwt.decode(accessToken)).userId;

	console.log("In resend otp".green);
	console.log("userId = "+ userId);

	const email = req.body.email;
	console.log("email = "+ email);
	const otp = await emailOtp(email, userId);
	res.status(200).send({
		msg: "Otp sent successfully",
		otp: otp
	});
}



module.exports = {
	emailOtp,
	verifyOtp,
	resendOtp,
};
