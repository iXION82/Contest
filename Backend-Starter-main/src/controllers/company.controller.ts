import { Request, Response } from "express";
import Company from "../models/company.model.js";

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this email already exists" });
        }

        const newCompany = new Company({
            name,
            email,
            password,
            jobsIds: []
        });

        await newCompany.save();

        res.status(201).json({ message: "Company registered successfully", company: newCompany, _id: newCompany._id });
    } catch (error: any) {
        res.status(500).json({ message: "Error registering company", error: error.message });
    }
};

export const loginCompany = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (company.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", company, _id: company._id });
    } catch (error: any) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
