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
	userId: {
		type: String,
		required: true,
		ref : 'users'
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
