import api from "./axios";

/**
 * Fetch all products with optional filters (category, search, sort, page, limit)
 */
export async function getProducts(params = {}) {
  return api.get("/products", { params });
}

/**
 * Fetch distinct product categories from server
 */
export async function getCategories() {
  return api.get("/products/categories");
}

/**
 * Fetch single product by ID or Slug
 */
export async function getProductByIdOrSlug(idOrSlug) {
  return api.get(`/products/${idOrSlug}`);
}

/**
 * Create/post a fish seed product (Seller/Customer)
 */
export async function createFishSeedProduct(productData) {
  return api.post("/products/fish-seed", productData);
}
