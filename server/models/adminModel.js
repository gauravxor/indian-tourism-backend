const mongoose = require('mongoose');

import {defaultUserImage} from "../fileUrls"

const adminSchema = new mongoose.Schema({

	userImageURL: {
		type: String,
		required: true,
		default: defaultUserImage,
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

	address: {
		addressMain: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		pincode: {
			type: Number,
			required: true,
		},
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

	locationCount : {
		type: Number,
		default: 0,
	},

	accessKey: {
		type: String,
	},

	locations: [
		{
			_id: false,
			locationId: {
				_id: false,
				type: String,
				required: true,
				ref: 'locations',
			}
		}
	]
});



const adminModel = mongoose.model('admins', adminSchema);

module.exports = adminModel;