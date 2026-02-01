import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Job from "./models/job.model.js";

dotenv.config();

const clearDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB");

        await User.deleteMany({});
        console.log("Users cleared");

        await Job.deleteMany({});
        console.log("Jobs cleared");

        process.exit(0);
    } catch (error) {
        console.error("Error clearing DB:", error);
        process.exit(1);
    }
};

clearDB();
