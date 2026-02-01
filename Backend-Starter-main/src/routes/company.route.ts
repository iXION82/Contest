import express from "express";
import { createCompany, loginCompany } from "../controllers/company.controller.js";
import { getCompanyJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/register", createCompany);
router.post("/login", loginCompany);
router.get("/jobs", getCompanyJobs);

export default router;
