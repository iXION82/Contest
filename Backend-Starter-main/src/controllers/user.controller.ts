import { Request, Response } from "express";
import User, { type IUser } from "../models/user.model.js";
import { TextExtractionService } from "../services/text-extraction.service.js";
import { LinkExtractionService } from "../services/link-extraction.service.js";
import { OpenAIService } from "../services/openai.service.js";


export const createUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;

        const newUser = new User({ ...userData, isProfileComplete: false });
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

        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { ...req.body, isProfileComplete: true }, { new: true });

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
        console.log("parseUserFromFiles called");

        const files = req.files as Express.Multer.File[];
        const links = JSON.parse(req.body.links || "[]");

        let extractedText = "";

        // 1. Extract text from files
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.mimetype === "application/pdf") {
                    try {
                        const text = await TextExtractionService.extractTextFromPDF(file.buffer);
                        extractedText += `\n--- FILE: ${file.originalname} ---\n${text}`;
                    } catch (e: any) {
                        console.error(`Failed to parse PDF ${file.originalname}:`, e);
                        extractedText += `\n--- FILE: ${file.originalname} (ERROR) ---\nFailed to parse PDF: ${e.message}`;
                    }
                }
            }
        }

        // 2. Extract text from links
        if (links && Array.isArray(links)) {
            for (const link of links) {
                if (typeof link === "string" && link.startsWith("http")) {
                    try {
                        const text = await LinkExtractionService.extractTextFromLink(link);
                        extractedText += `\n--- LINK: ${link} ---\n${text}`;
                    } catch (e: any) {
                        console.error(`Failed to parse link ${link}:`, e);
                    }
                }
            }
        }

        if (!extractedText.trim()) {
            return res.status(400).json({ error: "No text could be extracted from provided files or links." });
        }

        // 3. Process with OpenAI
        console.log("Sending text to OpenAI...", extractedText.length, "chars");
        const userData = await OpenAIService.parseResume(extractedText);
        console.log("Parsed User Data:", userData);

        // 4. Save to Database (Create User)
        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({
            message: "User parsed and created successfully",
            user: newUser,
            extractedTextPreview: extractedText.substring(0, 200) + "..."
        });

    } catch (err: any) {
        console.error("Parse error:", err);
        if (err.code === 11000) {
            return res.status(409).json({ error: "User with this email already exists." });
        }
        res.status(500).json({
            error: "Parse error",
            details: err.message,
            stack: err.stack
        });
    }
};
