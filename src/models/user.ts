import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { defaultUserImage } from "@root/src/fileUrls";

interface IUser extends Document {
    _id: Types.ObjectId;
    userImageURL: string;
    name: {
        firstName?: string;
        lastName?: string;
    };
    contact: {
        phone?: number;
        email: string;
    };
    gender?: string;
    isEmailVerified: boolean;
    walletBalance: number;
    address: {
        addressMain?: string;
        country: string;
        state?: string;
        city?: string;
        pincode?: number;
    };
    dob?: Date;
    createdAt: Date;
    updatedAt: Date;
    bookingCount: number;
    bookings: {
        bookingId: string;
    }[];
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
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
        },
        email: {
            type: String,
            required: true,
        },
    },

    gender: {
        type: String,
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
        },
        country: {
            type: String,
            required: true,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        pincode: {
            type: Number,
        },
    },

    dob: {
        type: Date,
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
                ref: "bookings",
            },
        },
    ],
});

const UserModel: Model<IUser> = mongoose.model<IUser>("users", userSchema);

export { IUser, UserModel };
