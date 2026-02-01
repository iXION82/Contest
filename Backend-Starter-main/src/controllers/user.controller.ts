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
        console.error("Update User Error:", error);
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

export const completeUserProfile = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("completeUserProfile called");

        // 1. Get User ID and Manual Data
        const { userId, ...manualData } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" });
        }

        const files = req.files as Express.Multer.File[];
        // Parse links if provided, handle both stringified JSON or direct array if middleware allows (multer sends body as strings mostly)
        let links: string[] = [];
        try {
            if (manualData.links) {
                links = JSON.parse(manualData.links);
            } else if (manualData.projectLinks) {
                // Fallback if frontend sends projectLinks as string/array directly
                links = Array.isArray(manualData.projectLinks) ? manualData.projectLinks : manualData.projectLinks.split(',').map((l: string) => l.trim());
            }
        } catch (e) {
            console.log("Error parsing links:", e);
        }

        let extractedText = "";

        // 2. Extract Text from Files (Resume)
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.mimetype === "application/pdf") {
                    try {
                        const text = await TextExtractionService.extractTextFromPDF(file.buffer);
                        extractedText += `\n--- RESUME (${file.originalname}) ---\n${text}`;
                    } catch (e: any) {
                        console.error(`Failed to parse PDF ${file.originalname}:`, e);
                    }
                }
            }
        }

        // 3. Extract Text from Links
        if (links && links.length > 0) {
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

        // 4. Get AI Data (if text exists)
        let aiData: any = {};
        if (extractedText.trim()) {
            console.log("Sending profiling text to OpenAI...", extractedText.length, "chars");
            try {
                aiData = await OpenAIService.parseResume(extractedText);
                console.log("AI Data Recieved:", Object.keys(aiData));
            } catch (error) {
                console.error("OpenAI Error:", error);
            }
        }

        // 5. Merge Data: Manual overrides AI
        // We only take AI values if Manual value is missing/empty
        const cleanManualData: any = {};
        Object.keys(manualData).forEach(key => {
            if (manualData[key] !== undefined && manualData[key] !== "" && manualData[key] !== "null") {
                // Try to parse numbers/arrays if they came as strings from FormData
                if (!isNaN(Number(manualData[key])) && key !== 'phoneNumber' && key !== 'password') {
                    cleanManualData[key] = Number(manualData[key]);
                } else if (typeof manualData[key] === 'string' && (manualData[key].includes(',') || key.includes('Skills') || key.includes('Roles'))) {
                    cleanManualData[key] = manualData[key].split(',').map((s: string) => s.trim());
                } else {
                    cleanManualData[key] = manualData[key];
                }
            }
        });

        // Smart Merge
        const finalData = { ...aiData, ...cleanManualData, isProfileComplete: true };

        // 6. Update User
        const updatedUser = await User.findByIdAndUpdate(userId, finalData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile completed successfully",
            user: updatedUser,
            aiSourceUsed: !!extractedText.trim()
        });

    } catch (err: any) {
        console.error("Profile Completion Error:", err);
        res.status(500).json({
            error: "Error completing profile",
            details: err.message
        });
    }
};
