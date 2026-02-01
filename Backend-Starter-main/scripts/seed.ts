
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../src/models/user.model.js';
import Job from '../src/models/job.model.js';
import Company from '../src/models/company.model.js'; // Assuming you have this model based on previous context

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hackathon";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected for Seeding");
    } catch (err) {
        console.error("Connection Error:", err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log("Clearing existing data...");
    /* 
    Optional: Uncomment to clear data before seeding
    await User.deleteMany({});
    await Job.deleteMany({});
    await Company.deleteMany({});
    */

    console.log("Seeding Users...");
    const users = [];
    const skillsList = ["React", "Node.js", "Python", "Java", "MongoDB", "AWS", "Design", "Marketing"];

    for (let i = 0; i < 20; i++) {
        const user = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: "password123", // Default password for testing
            phoneNumber: faker.phone.number(),
            skills: faker.helpers.arrayElements(skillsList, { min: 2, max: 5 }),
            experience: faker.number.int({ min: 0, max: 15 }),
            resume: faker.internet.url(),
            preferredLocations: [faker.location.city(), "Remote"],
            expectedSalary: faker.number.int({ min: 40000, max: 150000 }),
            isProfileComplete: true,
            role: 'user'
        });
        users.push(await user.save());
    }
    console.log(`Created ${users.length} users.`);

    console.log("Seeding Companies...");
    const companies = [];
    // Creating 5 synthetic companies to share jobs
    for (let i = 0; i < 5; i++) {
        const companyName = faker.company.name();
        const companyEmail = faker.internet.email({ firstName: companyName });
        // Assuming Company model handles auth like User or Job stores company details directly
        // Based on previous code, Job model stores companyEmail and companyPassword directly sometimes? 
        // Or there is a Company model. I will create a simple object mostly to reuse details for Jobs.
        companies.push({
            name: companyName,
            email: companyEmail,
            password: "password123",
            website: faker.internet.url()
        });

        // If Company model exists and you want to register them as entities:
        /*
        const newCompany = new Company({
             name: companyName,
             email: companyEmail,
             password: "password123",
             // ... other fields
        });
        await newCompany.save();
        */
    }

    console.log("Seeding Jobs...");
    const jobs = [];
    for (let i = 0; i < 35; i++) {
        // Pick a random company
        const company = faker.helpers.arrayElement(companies);

        const job = new Job({
            title: faker.person.jobTitle(),
            company: company.name,
            companyEmail: company.email,
            companyPassword: company.password, // Required by your current model structure
            requiredSkills: faker.helpers.arrayElements(skillsList, { min: 2, max: 4 }),
            minExperience: faker.number.int({ min: 0, max: 5 }),
            salary: faker.number.int({ min: 50000, max: 200000 }),
            jobType: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract", "Remote"]),
            location: faker.location.city(),
            description: faker.lorem.paragraph(),
            peopleIds: [], // Will populate next
        });
        jobs.push(await job.save());
    }
    console.log(`Created ${jobs.length} jobs.`);

    console.log("Assigning Applicants...");
    for (const job of jobs) {
        // Randomly decide if this job has applicants (80% chance)
        if (Math.random() > 0.2) {
            // Pick rand number of applicants (1 to 8)
            const applicantsCount = faker.number.int({ min: 1, max: 8 });
            const selectedUsers = faker.helpers.arrayElements(users, applicantsCount);

            for (const user of selectedUsers) {
                // Link User to Job (appliedJobs)
                user.appliedJobs.push(job._id);
                await user.save();

                // Link Job to User (peopleIds)
                job.peopleIds.push(user._id);
            }
            await job.save();
        }
    }

    console.log("Seeding Complete!");
    process.exit(0);
};

seedData();
