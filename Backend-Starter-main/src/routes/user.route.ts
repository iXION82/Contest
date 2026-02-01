import express from "express";
import { createUser, updateUser, getUserApplications } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/update", updateUser);
router.get("/:userId/applications", getUserApplications);

export default router;
