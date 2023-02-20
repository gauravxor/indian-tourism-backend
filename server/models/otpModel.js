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
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const otpModel = mongoose.model('otp', otpSchema);

module.exports = otpModel;