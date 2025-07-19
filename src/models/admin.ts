import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { defaultUserImage } from "@root/src/fileUrls";

interface IAdmin extends Document {
    _id: Types.ObjectId;
    userImageURL: string;
    name: {
        firstName: string;
        middleName?: string;
        lastName: string;
    };
    contact: {
        phone?: number;
        email: string;
    };
    address: {
        addressMain?: string;
        country: string;
        state?: string;
        city?: string;
        pincode?: number;
    };

    dob?: Date;
    accessKey: string;
    locationCount: number;
    locations: {
        locationId: string;
    }[];

    createdAt: Date;
    updatedAt: Date;
}

const adminSchema: Schema<IAdmin> = new mongoose.Schema<IAdmin>({
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

    locationCount: {
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
                ref: "locations",
            },
        },
    ],
});

const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>("admins", adminSchema);

export { IAdmin, AdminModel };
