const mongoose = require('mongoose');


const tempBookingNumber = new mongoose.Schema({

	// this lock id will be used to identify the lock
	// and it is the temporary booking id.
	lockId: {
		type: String,
		required: true,
	},
	locationId: {
		type: String,
		required: true,
		ref : 'locations'
	},
	locationName: {
		type: String,
		required: true,
	},
	locationDesc: {
		type: String,
		required: true,
	},
	locationAddress: {
		type: Object,
		required: true,
	},

	userId: {
		type: String,
		required: true,
		ref : 'users'
	},
	userName: {
		type: String,
		required: true,
	},
	noOfTickets: {
		type: Number,
		required: true,
	},

	bookingPrice : {
		type: Number,
		required: true,
	},

	dateOfVisit: {
		type: Date,
		required: true,
	},
	timeOfExpiry: {
		type: Date,
		required: true,
	}

});


const tempBookingIdModel = mongoose.model('tempBookings', tempBookingNumber);

module.exports = tempBookingIdModel;
