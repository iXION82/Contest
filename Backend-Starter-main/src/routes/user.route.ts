import express from "express";
import { createUser, updateUser, getUserApplications, parseUserFromFiles, getUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/update", updateUser);
router.get("/profile/:id", getUserProfile);
router.get("/:id/applications", getUserApplications);

router.post(
    "/parse",
    upload.array("files"),
    parseUserFromFiles
);

export default router;
