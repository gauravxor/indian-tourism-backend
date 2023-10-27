const mongoose = require('mongoose');
import { defaultUserImage } from "../fileUrls"


const userSchema = new mongoose.Schema({

    userImageURL: {
        type: String,
        required: true,
        default: defaultUserImage,
    },

    name: {
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
    gender: {
        type: String,
        required: true,
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
                required: true,
                ref: 'bookings',
            },
        }
    ]
});



const userModel = mongoose.model('users', userSchema);

module.exports = userModel;