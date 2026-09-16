import api from "./axios";

/**
 * 1. Seller Dashboard Statistics
 * Strictly scoped to the authenticated seller
 */
export async function getSellerDashboardStats() {
  return api.get("/seller/dashboard/stats");
}

/**
 * 2. Seller Product Management
 */
export async function getSellerProducts(params = {}) {
  return api.get("/seller/products", { params });
}

export async function getSellerProductById(idOrSlug) {
  return api.get(`/seller/products/${idOrSlug}`);
}

export async function createSellerProduct(formData) {
  return api.post("/seller/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateSellerProduct(id, formData) {
  return api.put(`/seller/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteSellerProduct(id) {
  return api.delete(`/seller/products/${id}`);
}

/**
 * 3. Seller Registration
 * Endpoint: POST /auth/seller/register
 */
export async function registerSeller(sellerData) {
  return api.post("/auth/seller/register", sellerData);
}
