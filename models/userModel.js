const mongoose = require('mongoose');
const { defaultUserImage } = require('../fileUrls');

const userSchema = new mongoose.Schema({

    userImageURL: {
        type: String,
        default: defaultUserImage,
    },

    name: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
    },

    contact: {
        phone: {
            type: Number,
            required: false,
        },
        email: {
            type: String,
        },
    },
    gender: {
        type: String,
        required: false,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    walletBalance: {
        type: Number,
        default: 0,
    },

    address: {
        addressMain: {
            type: String,
            required: false,
        },
        country: {
            type: String,
        },
        state: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        pincode: {
            type: Number,
            required: false,
        },
    },

    dob: {
        type: Date,
        required: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    bookingCount: {
        type: Number,
        default: 0,
    },
    bookings: [
        {
            _id: false,
            bookingId: {
                _id: false,
                type: String,
                ref: 'bookings',
            },
        },
    ],
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
