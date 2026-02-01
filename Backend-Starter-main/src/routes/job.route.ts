import express from "express";
import { addJob, recommendJobs, applyJob, getAllJobs, getJobApplicants, getCompanyJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/company", (req, res, next) => {
    getCompanyJobs(req, res);
});
router.post("/add", addJob);
router.get("/", getAllJobs);
router.get("/recommend/:userId", recommendJobs);
router.get("/:jobId/applicants", getJobApplicants);
router.post("/apply", applyJob);

export default router;

