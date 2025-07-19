import { Schema, model, Document, Types } from "mongoose";

interface IOtp extends Document {
    _id: Types.ObjectId;
    userId: string;
    emailId: string;
    otp: string;
    otpType: string; // 'emailVerification' | 'passwordReset'
    isResetOtpValidated: boolean;
    createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
    userId: {
        type: String,
        required: true,
        ref: "users",
    },
    emailId: {
        type: String,
        required: true,
        ref: "users",
    },
    otp: {
        type: String,
        required: true,
    },
    otpType: {
        type: String,
        required: true,
    },
    isResetOtpValidated: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OtpModel = model<IOtp>("otp", otpSchema);

export { OtpModel, IOtp };
