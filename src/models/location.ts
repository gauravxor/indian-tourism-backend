import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface ILocationImage {
    imageType?: string;
    urls?: string;
}

interface ICoordinates {
    latitude?: number;
    longitude?: number;
}

interface ILocation extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
    coordinates?: ICoordinates;
    ticketPrice: number;
    images?: ILocationImage[];
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
}

const locationImageSchema = new Schema<ILocationImage>(
    {
        imageType: {
            type: String,
            required: false,
        },
        urls: {
            type: String,
            required: false,
        },
    },
    { _id: false }
);

const locationSchema = new Schema<ILocation>({
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
        default: "India",
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
    name: "text",
    description: "text",
    address: "text",
    city: "text",
    state: "text",
    country: "text",
    pincode: "text",
});

const LocationModel: Model<ILocation> = mongoose.model<ILocation>(
    "locations",
    locationSchema
);

export { ILocation, LocationModel };
