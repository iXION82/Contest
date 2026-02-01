import express from "express";
import { createCompany, loginCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.post("/register", createCompany);
router.post("/login", loginCompany);

export default router;
