import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    password: string;
    age: number;
    experience: number;
    skills: string[];
    totalProjects: number;
    projectLinks: string[];
    preferredRoles: string[];
    preferredLocations: string[];
    expectedSalary: number;
    preferredJobTypes: string[];
    appliedJobs: string[];
}

const UserSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        age: { type: Number, required: true },
        experience: { type: Number, required: true },
        skills: { type: [String], required: true },
        totalProjects: { type: Number, default: 0 },
        projectLinks: { type: [String], default: [] },
        preferredRoles: { type: [String], default: [] },
        preferredLocations: { type: [String], default: [] },
        expectedSalary: { type: Number, required: true },
        preferredJobTypes: { type: [String], default: [] },
        appliedJobs: { type: [String], default: [] },
    },

    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
