const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	bookingId: {
		type: String,
		required: true,
	},
	locationId: {
		type: String,
		required: true,
		ref: 'locations'
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
		ref: 'users'
	},
	userName: {
		type: String,
		required: true,
	},

	dateOfVisit: {
		type: Date,
		required: true,
	},
	noOfTickets: {
		type: Number,
		required: true,
	},
	bookingPrice: {
		type: Number,
		required: true,
	},
	timeOfBooking: {
		type: Date,
		required: true,
	},
	cancellationStatus: {
		type: String,
		required: true,
		default: "na"
	}
});


const bookingModel = mongoose.model('bookings', bookingSchema);
module.exports = bookingModel;
