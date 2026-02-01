import { Request, Response } from "express";
import User, { type IUser } from "../models/user.model.js";


export const createUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;

        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser, _id: newUser._id });
    } catch (error: any) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user, _id: user._id });
    } catch (error: any) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required for update" });
        }

        const updatedUser = await User.findOneAndUpdate({ userId }, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error: any) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};


export const getUserApplications = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobs = await import("../models/job.model.js").then(m => m.default.find({ _id: { $in: user.appliedJobs } }));
        res.status(200).json({ applications: jobs });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};
export const parseUserFromFiles = async (
    req: Request,
    res: Response
) => {
    try {
        const files = req.files as Express.Multer.File[];
        const links = JSON.parse(req.body.links || "[]");

        res.json({
            message: "Files and links received",
            filesCount: files?.length || 0,
            links,
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

