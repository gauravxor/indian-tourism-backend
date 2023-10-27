const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
	bookingId: {
		type: String,
		required: true,
	},
	adminId: {
		type: String,
		required: true,
		ref: 'admins'
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
});


const cancellationModel = mongoose.model('cancellations', cancellationSchema);
module.exports = cancellationModel;
