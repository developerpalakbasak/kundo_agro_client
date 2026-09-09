import api from "./axios";

export async function loginUser({ email, password }) {
  return api.post("/auth/login", { email, password });
}

export async function registerUser({ name, email, password, phone }) {
  return api.post("/auth/register", { name, email, password, phone });
}

export async function logoutUser() {
  return api.post("/auth/logout");
}

export async function getCurrentUser() {
  return api.get("/auth/me");
}
