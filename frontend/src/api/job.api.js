import api from "./axios";

// GET /jobs
export const getAllJobs = () => api.get("/jobs");

// POST /jobs/add
export const addJob = (jobData) =>
  api.post("/jobs/add", jobData);

// POST /jobs/apply
export const applyJob = (userId, jobId) =>
  api.post("/jobs/apply", { userId, jobId });

// GET /jobs/recommend/:userId
export const recommendJobs = (userId) =>
  api.get(`/jobs/recommend/${userId}`);

// GET /jobs/:jobId/applicants
export const getApplicants = (jobId) =>
  api.get(`/jobs/${jobId}/applicants`);

// GET /company/jobs?query=email
export const getCompanyJobs = (query) =>
  api.get(`/company/jobs?query=${query}`);

// DELETE /jobs/:id
export const deleteJob = (jobId) =>
  api.delete(`/jobs/${jobId}`);
