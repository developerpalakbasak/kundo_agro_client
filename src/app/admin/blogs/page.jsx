"use client";

import { useEffect, useState } from "react";
import { getAdminBlogs, deleteAdminBlog } from "@/lib/api/admin";
import { BlogsList } from "@/components/admin/BlogsList";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminBlogs();
      if (res && res.blogs && Array.isArray(res.blogs)) {
        setBlogs(res.blogs);
      } else if (res && res.data && Array.isArray(res.data)) {
        setBlogs(res.data);
      } else if (Array.isArray(res)) {
        setBlogs(res);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error("Failed to load admin blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDeleteBlog = async (id) => {
    await deleteAdminBlog(id);
    setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading blog posts...</span>
        </div>
      </div>
    );
  }

  return <BlogsList blogs={blogs} onDeleteBlog={handleDeleteBlog} />;
}
