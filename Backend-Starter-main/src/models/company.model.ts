import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
    name: string;
    email: string;
    jobsIds: string[];
    password: string;
}

const CompanySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        jobsIds: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model<ICompany>("Company", CompanySchema);
