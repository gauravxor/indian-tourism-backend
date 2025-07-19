import { Schema, model, Document } from "mongoose";

interface ITempBooking extends Document {
    lockId: string;
    locationId: string;
    locationName: string;
    locationDesc: string;
    locationAddress: object;
    userId: string;
    userName: string;
    noOfTickets: number;
    bookingPrice: number;
    dateOfVisit: Date;
    timeOfExpiry: Date;
}

const tempBookingSchema = new Schema<ITempBooking>({
    lockId: {
        type: String,
        required: true,
    },
    locationId: {
        type: String,
        required: true,
        ref: "locations",
    },
    locationName: {
        type: String,
        required: true,
    },
    locationDesc: {
        type: String,
        required: true,
    },
    locationAddress: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        ref: "users",
    },
    userName: {
        type: String,
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
    dateOfVisit: {
        type: Date,
        required: true,
    },
    timeOfExpiry: {
        type: Date,
        required: true,
    },
});

const TempBookingModel = model<ITempBooking>("tempBookings", tempBookingSchema);

export { TempBookingModel, ITempBooking };
