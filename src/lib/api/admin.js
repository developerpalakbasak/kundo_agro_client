import api from "./axios";

// ── Dashboard Stats ───────────────────────────────────────────
export async function getDashboardStats() {
  return api.get("/admin/stats");
}

// ── Products Management ────────────────────────────────────────
export async function getAdminProducts(params = {}) {
  return api.get("/admin/products", { params });
}

export async function getAdminProductById(id) {
  return api.get(`/admin/products/${id}`);
}

export async function createAdminProduct(formData) {
  return api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateAdminProduct(id, formData) {
  return api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteAdminProduct(id) {
  return api.delete(`/admin/products/${id}`);
}

// ── Categories Management (under admin products) ─────────────
export async function getAdminCategories() {
  return api.get("/products/categories");
}

export async function createProductCategory(name) {
  return api.post("/products/categories", { name });
}

export async function createAdminCategory(categoryData) {
  return api.post("/admin/products/category/create", categoryData);
}

export async function updateAdminCategory(slug, categoryData) {
  return api.put(`/admin/products/category/update/${slug}`, categoryData);
}

export async function deleteAdminCategory(slug) {
  return api.delete(`/admin/products/category/delete/${slug}`);
}

// ── Blogs Management ──────────────────────────────────────────
export async function getAdminBlogs(params = {}) {
  return api.get("/admin/blogs", { params });
}

export async function getAdminBlogById(id) {
  return api.get(`/admin/blogs/${id}`);
}

export async function createAdminBlog(formData) {
  return api.post("/admin/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateAdminBlog(id, formData) {
  return api.put(`/admin/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteAdminBlog(id) {
  return api.delete(`/admin/blogs/${id}`);
}

// ── Orders Management ─────────────────────────────────────────
export async function getAdminOrders(params = {}) {
  return api.get("/admin/orders", { params });
}

export async function updateOrderStatus(orderId, status) {
  return api.patch(`/admin/orders/${orderId}/status`, { status });
}

export async function updateOrderPaymentStatus(orderId, paymentStatus) {
  return api.patch(`/admin/orders/${orderId}/payment`, { paymentStatus });
}

// ── Users & Password Management ──────────────────────────────
export async function getAdminUsers(params = {}) {
  return api.get("/admin/users", { params });
}

export async function createAdminUser(userData) {
  return api.post("/admin/users", userData);
}

export async function updateUserRole(userId, role) {
  return api.patch(`/admin/users/${userId}/role`, { role });
}

export async function deleteAdminUser(userId) {
  return api.delete(`/admin/users/${userId}`);
}

export async function changeAdminPassword(oldPassword, newPassword) {
  return api.post("/auth/changepassword", { oldPassword, newPassword });
}

export async function resetUserPasswordByAdmin(userId, newPassword) {
  return api.post(`/admin/users/${userId}/change-password`, { userId, newPassword });
}

// ── Sellers Management (derived / filterable) ─────────────────
export async function getAdminSellers() {
  // Sellers are products with seller info or user sellers
  return api.get("/admin/sellers");
}

export async function toggleSellerStatus(id, status) {
  return api.patch(`/admin/sellers/${id}/approve`, { status });
}

