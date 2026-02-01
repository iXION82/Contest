import api from "./axios";

// POST /user/create
export const createUser = (userData) =>
  api.post("/user/create", userData);

// PUT /user/update
export const updateUser = (userData) =>
  api.put("/user/update", userData);

// GET /user/:userId/applications
export const getApplications = (userId) =>
  api.get(`/user/${userId}/applications`);
