import mongoose, { Document, Model, Schema } from "mongoose";

interface ICredentials extends Document {
    userId: string;
    password: string;
    resetId?: number;
    resetIdExpiry?: number;
}

const credentialsSchema: Schema<ICredentials> =
    new mongoose.Schema<ICredentials>({
        userId: {
            type: String,
            required: true,
            ref: "users",
        },
        password: {
            type: String,
            required: true,
        },
        resetId: {
            type: Number,
            required: false,
        },
        resetIdExpiry: {
            type: Number,
            required: false,
        },
    });

const CredentialsModel: Model<ICredentials> = mongoose.model<ICredentials>(
    "credentials",
    credentialsSchema
);

export { ICredentials, CredentialsModel };
