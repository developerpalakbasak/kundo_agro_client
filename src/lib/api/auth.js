import api from "./axios";

export async function loginUser({ email, identifier, password, sellerFor }) {
  return api.post("/auth/login", { 
    email: email || identifier,
    identifier: identifier || email, 
    password,
    sellerFor
  });
}

export async function registerUser({ name, email, password, phone, role }) {
  return api.post("/auth/user/register", { name, email, password, phone, role });
}

export async function logoutUser() {
  return api.post("/auth/logout");
}

export async function registerSeller(sellerData) {
  return api.post("/auth/seller/register", sellerData);
}

export async function getCurrentUser() {
  return api.get("/auth/me");
}

