import mongoose, { Document, Schema, Model } from "mongoose";

interface ICancellation extends Document {
    bookingId: string;
    adminId: string;
    locationId: string;
    locationName: string;
    userId: string;
    userName: string;
    dateOfVisit: Date;
    noOfTickets: number;
    bookingPrice: number;
}

const cancellationSchema = new Schema<ICancellation>({
    bookingId: {
        type: String,
        required: true,
    },
    adminId: {
        type: String,
        required: true,
        ref: "admins",
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
    userId: {
        type: String,
        required: true,
        ref: "users",
    },
    userName: {
        type: String,
        required: true,
    },
    dateOfVisit: {
        type: Date,
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
});

const CancellationModel: Model<ICancellation> = mongoose.model<ICancellation>(
    "cancellations",
    cancellationSchema
);

export { ICancellation, CancellationModel };
