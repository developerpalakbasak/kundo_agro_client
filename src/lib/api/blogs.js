import api from "./axios";

/**
 * Fetch all products with optional filters (category, search, sort, page, limit)
 */
export async function getBlogs() {
    return api.get("/blogs");
}

export async function getBlogById(id) {
    return api.get(`/blogs/${id}`);
}

export async function getBlogBySlug(slug) {
    return api.get(`/blogs/${slug}`);
}

