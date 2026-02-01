import { findMatches } from "./services/matching.service.js";
import User from "./models/user.model.js";
import Job from "./models/job.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testMatching = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/job-matching-db");
        console.log("Connected to DB");

        // 1. Clear existing test data
        await User.deleteMany({ email: "test.matcher@example.com" });
        await Job.deleteMany({ title: "Test Job Logic" });

        // 2. Create Test User
        const user = await User.create({
            name: "Test Matcher",
            email: "test.matcher@example.com",
            password: "password123",
            skills: ["JavaScript", "TypeScript"],
            experience: 2,
            expectedSalary: 100000,
            preferredRoles: ["Developer"],
            preferredLocations: ["Remote"],
            preferredJobTypes: ["Full-time"]
        });

        // 3. Create Test Jobs
        // Job A: Pays LESS than expected (Should have lower score logically)
        const jobLowPay = await Job.create({
            title: "Test Job Logic - Low Pay",
            company: "LowPay Corp",
            companyEmail: "hr@lowpay.com",
            companyPassword: "pass",
            requiredSkills: ["JavaScript"],
            minExperience: 1,
            location: "Remote",
            salary: 50000, // 50k < 100k expected
            jobType: "Full-time",
            description: "A job."
        });

        // Job B: Pays MORE than expected (Should have higher score)
        const jobHighPay = await Job.create({
            title: "Test Job Logic - High Pay",
            company: "HighPay Corp",
            companyEmail: "hr@highpay.com",
            companyPassword: "pass",
            requiredSkills: ["JavaScript"],
            minExperience: 1,
            location: "Remote",
            salary: 150000, // 150k > 100k expected
            jobType: "Full-time",
            description: "A job."
        });

        console.log("\n--- Running Match ---");
        const matches = await findMatches(user);

        matches.forEach(m => {
            if (m.title.includes("Test Job Logic")) {
                console.log(`Job: ${m.title} | Salary: ${m.salary} | Score: ${(m as any).score}`);
            }
        });

        console.log("\n--- Analysis ---");
        const matchLow = matches.find(m => m.title.includes("Low Pay"));
        const matchHigh = matches.find(m => m.title.includes("High Pay"));

        if (matchLow && matchHigh) {
            console.log(`Low Pay Score: ${(matchLow as any).score}`);
            console.log(`High Pay Score: ${(matchHigh as any).score}`);

            if ((matchLow as any).score > (matchHigh as any).score) {
                console.error("❌ BUG: Low paying job scored HIGHER than High paying job!");
            } else {
                console.log("✅ High paying job scored higher (as expected).");
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

testMatching();
