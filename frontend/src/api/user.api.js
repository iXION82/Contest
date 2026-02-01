import api from "./axios";




export const updateUser = (userData) =>
  api.put("/user/update", userData);


export const getApplications = (userId) =>
  api.get(`/user/${userId}/applications`);

// PUT /user/complete-profile (Multipart)
export const uploadProfileData = (formData) =>
  api.put("/user/complete-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
