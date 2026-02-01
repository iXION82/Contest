import api from "./axios";



// PUT /user/update
export const updateUser = (userData) =>
  api.put("/user/update", userData);

// GET /user/:userId/applications
export const getApplications = (userId) =>
  api.get(`/user/${userId}/applications`);
