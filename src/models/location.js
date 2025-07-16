const mongoose = require('mongoose');

const locationImageSchema = new mongoose.Schema({
    _id: false,
    imageType: {
        type: String,
        required: false,
    },
    urls: {
        type: String,
        required: false,
    },
});

const locationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
        default: 'India',
    },

    pincode: {
        type: Number,
        required: true,
    },

    coordinates: {
        latitude: {
            type: Number,
            required: false,
        },
        longitude: {
            type: Number,
            required: false,
        },
    },

    ticketPrice: {
        type: Number,
        required: true,
    },

    images: {
        type: [locationImageSchema],
        required: false,
    },

    capacity: {
        type: Number,
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
});

locationSchema.index({
    name: 'text',
    description: 'text',
    address: 'text',
    city: 'text',
    state: 'text',
    country: 'text',
    pincode: 'text',
});

const locationModel = mongoose.model('locations', locationSchema);

module.exports = locationModel;
