"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { BlogForm } from "@/components/admin/BlogForm";
import { getAdminBlogById, updateAdminBlog } from "@/lib/api/admin";

export default function EditBlogPage({ params }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getAdminBlogById(blogId)
      .then((res) => {
        if (res && res.data) {
          setBlog(res.data);
        } else if (res) {
          setBlog(res);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to fetch blog post details.");
      })
      .finally(() => setIsLoading(false));
  }, [blogId]);

  const handleSubmit = async (formData) => {
    await updateAdminBlog(blogId, formData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !blog) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-red-600">⚠️ {errorMsg || "Blog post not found"}</p>
        <Link href="/admin/blogs" className="inline-block text-xs font-bold text-red-700 underline">
          ← Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Blog Post</h1>
          <p className="mt-1 text-sm text-gray-500">Update blog article details and publication status.</p>
        </div>
        <Link
          href="/admin/blogs"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          ← Back to blogs
        </Link>
      </div>

      <BlogForm initialData={blog} onSubmit={handleSubmit} isEditing={true} />
    </div>
  );
}
