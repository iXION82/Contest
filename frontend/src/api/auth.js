import api from "./axios";

/* ================= AUTH ================= */
export const SignupApiCompany = (data) => api.post("/company/register", data);
export const LoginApiCompany = (data) => api.post("/company/login", data);
export const SignupApiUser = (data) => api.post("/user/create", data);
export const LoginApiUser = (data) => api.post("/user/login", data);
