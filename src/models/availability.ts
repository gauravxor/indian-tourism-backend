import mongoose, { Document, Schema, Model } from "mongoose";

interface IDay {
    calendarDate: Date;
    availableTickets: number;
}

interface IMonth {
    month: number;
    year: number;
    days: IDay[];
}

interface IAvailability extends Document {
    locationId: string;
    maxCapacity: number;
    calendarMonths: IMonth[];
}

const daySchema = new Schema<IDay>(
    {
        calendarDate: {
            type: Date,
            required: true,
        },
        availableTickets: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const monthSchema = new Schema<IMonth>(
    {
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        days: {
            type: [daySchema],
            required: true,
        },
    },
    { _id: false }
);

const availabilitySchema = new Schema<IAvailability>({
    locationId: {
        type: String,
        required: true,
        ref: "locations",
    },
    maxCapacity: {
        type: Number,
        required: true,
        ref: "locations",
    },
    calendarMonths: {
        type: [monthSchema],
        required: true,
    },
});

const AvailabilityModel: Model<IAvailability> = mongoose.model<IAvailability>(
    "availability",
    availabilitySchema
);

export { IAvailability, AvailabilityModel };
