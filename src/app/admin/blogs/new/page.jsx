"use client";

import Link from "next/link";
import { BlogForm } from "@/components/admin/BlogForm";
import { createAdminBlog } from "@/lib/api/admin";

export default function NewBlogPage() {
  const handleSubmit = async (formData) => {
    await createAdminBlog(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Blog Post</h1>
          <p className="mt-1 text-sm text-gray-500">Publish a new article for your customers.</p>
        </div>
        <Link
          href="/admin/blogs"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          ← Back to blogs
        </Link>
      </div>

      <BlogForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
