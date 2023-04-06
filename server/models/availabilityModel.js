const mongoose = require('mongoose');


const daySchema = new mongoose.Schema({

	_id: false,

	calendarDate: {
		type: Date,
		required: true
	},

	availableTickets: {
		type: Number,
		required: true,
	}
});

const monthSchema = new mongoose.Schema({

	_id: false,

	month: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	days: {
		type: [daySchema],
		required: true
	}
});


const availabilitySchema = new mongoose.Schema({

	locationId: {
		type: String,
		required: true,
		ref: 'locations',
	},

	maxCapacity: {
		type: Number,
		required: true,
		ref: 'locations',
	},

	calendarMonths:{
		type: [monthSchema],
		required: true
	}
});


const availabilityModel = mongoose.model('availability', availabilitySchema);

module.exports = availabilityModel;
