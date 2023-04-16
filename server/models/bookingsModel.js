const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	bookingId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
		ref: 'users'
	},
	locationId: {
		type: String,
		required: true,
		ref: 'locations'
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
	}
});


const bookingModel = mongoose.model('bookings', bookingSchema);
module.exports = bookingModel;
