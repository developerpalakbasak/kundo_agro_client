import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send/receive cookies automatically
});

// Response interceptor for unified error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

/**
 * Format relative image/upload paths to full backend server URL
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  
  const serverOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/api\/v1\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${serverOrigin}${cleanPath}`;
}

export default api;
