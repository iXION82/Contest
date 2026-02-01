import { Request, Response } from "express";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { findMatches } from "../services/matching.service.js";
import mongoose from "mongoose";

export const addJob = async (req: Request, res: Response) => {
    try {
        const jobData = req.body;
        const newJob = new Job(jobData);
        await newJob.save();
        res.status(201).json({ message: "Job added successfully", job: newJob });
    } catch (error: any) {
        res.status(500).json({ message: "Error adding job", error: error.message });
    }
};

export const recommendJobs = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" });
        }
        const user = await User.findOne({ userId: userId as string });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const recommendations = await findMatches(user);
        res.status(200).json({ recommendations });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching recommendations", error: error.message });
    }
};

export const applyJob = async (req: Request, res: Response) => {
    try {
        const { userId, jobId } = req.body;

        if (!userId || !jobId) {
            return res.status(400).json({ message: "UserId and JobId are required" });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.appliedJobs.includes(jobId)) {
            return res.status(400).json({ message: "Already applied to this job" });
        }

        await User.findOneAndUpdate(
            { userId },
            { $addToSet: { appliedJobs: jobId } }
        );

        const job = await Job.findOneAndUpdate(
            { jobId },
            { $addToSet: { peopleIds: userId } }
        );

        if (!job) {
            await User.findOneAndUpdate(
                { userId },
                { $pull: { appliedJobs: jobId } }
            );
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Applied successfully" });

    } catch (error: any) {
        res.status(500).json({ message: "Error applying to job", error: error.message });
    }
};

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json({ jobs });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

export const getJobApplicants = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.status(400).json({ message: "JobId is required" });
        }
        const job = await Job.findOne({ jobId: jobId });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const applicants = await User.find({ userId: { $in: job.peopleIds } });
        res.status(200).json({ applicants });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching applicants", error: error.message });
    }
};

export const getCompanyJobs = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter (email or company name) is required" });
        }

        const jobs = await Job.find({
            $or: [
                { companyEmail: query },
                { company: query }
            ]
        });

        res.status(200).json({ jobs });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching company jobs", error: error.message });
    }
};


