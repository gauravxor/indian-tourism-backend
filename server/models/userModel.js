const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

	userName: {
		type: String,
		required: true,
	},

	name:{
		firstName: {
			type: String,
			required: true,
		},
		middleName: {
			type: String,
			required: false,
		},
		lastName: {
			type: String,
			required: true,
		},
	},

	contact: {
		phone: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
	},

	isEmailVerified : {
		type: Boolean,
		default: false,
	},

	walletBalance : {
		type: Number,
		default: 0,
	},

	address: {
		addressMain: {
			type: String,
			required: true,
		},
		// country: {
		// 	type: String,
		// 	required: true,
		// },
		// state: {
		// 	type: String,
		// 	required: true,
		// },
		// city: {
		// 	type: String,
		// 	required: true,
		// },
		// pincode: {
		// 	type: Number,
		// 	required: true,
		// },
	},

	dob: {
		type: Date,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},

	updatedAt: {
		type: Date,
		default: Date.now,
	},

	bookingCount : {
		type: Number,
		default: 0,
	},

	bookings: [
		{
			_id: {
				type: mongoose.Schema.Types.ObjectId,
			},

			locationId: {
				type: mongoose.Schema.Types.ObjectId,
				// ref: 'locations',
				// required: true,
			},
			bookingDate: {
				type: Date,
				required: true,
			},
			dateOfVisit: {
				type: Date,
				required: true,
			},
			children: {
				type: Number,
				required: true,
			},
			adults: {
				type: Number,
				required: true,
			},
		}
	]
});



const userModel = mongoose.model('users', userSchema);

module.exports = userModel;