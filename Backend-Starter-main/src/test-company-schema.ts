import mongoose from "mongoose";
import Company from "./models/company.model.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const testCompany = async () => {
    await connectDB();

    try {
        const testCompanyData = {
            name: "Test Corp " + Math.floor(Math.random() * 1000),
            email: `testcorp${Math.floor(Math.random() * 1000)}@example.com`,
            password: "securepassword123",
            jobsIds: []
        };

        const newCompany = new Company(testCompanyData);
        const savedCompany = await newCompany.save();

        console.log("✅ Company created successfully:");
        console.log(savedCompany);

        // Verify we can find it
        const foundCompany = await Company.findById(savedCompany._id);
        if (foundCompany) {
            console.log("✅ Company retrieved successfully by ID");
        } else {
            console.error("❌ Failed to retrieve company");
        }

    } catch (error) {
        console.error("❌ Error testing Company model:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB Disconnected");
    }
};

testCompany();
