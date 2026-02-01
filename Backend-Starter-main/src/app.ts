import express from "express";
import healthRoute from "./routes/health.route.js";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import companyRoutes from "./routes/company.route.js";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", healthRoute);
app.use("/user", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/company", companyRoutes);

export default app;

