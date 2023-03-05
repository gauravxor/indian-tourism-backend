const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		ref: 'users',
	},

	emailId: {
		type: String,
		required: true,
		ref: 'users',
	},
	otp: {
		type: String,
		required: true,
	},
	otpType: { // if it is for email verification or password reset
		type: String,   // type = (emailVerification, passwordReset)
		required: true,
	},
	isResetOtpValidated: {  // if the otp for password reset is validated or not
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const otpModel = mongoose.model('otp', otpSchema);

module.exports = otpModel;