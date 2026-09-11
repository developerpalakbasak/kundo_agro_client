"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

function formatDate(value, locale) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogsList({ blogs = [], onDeleteBlog }) {
  const { t, language } = useLanguage();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete blog "${title}"?`)) return;
    try {
      setDeletingId(id);
      if (onDeleteBlog) await onDeleteBlog(id);
    } catch (err) {
      alert(err.message || "Failed to delete blog.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {blogs.length === 0
              ? "No blogs created yet."
              : `${blogs.length} articles published`}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-xs"
        >
          + Add Blog Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
          <p className="text-sm font-medium text-gray-900">No blog posts found</p>
          <p className="max-w-sm text-sm text-gray-500">
            Create educational & informational blog posts for your customers.
          </p>
          <Link
            href="/admin/blogs/new"
            className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-xs"
          >
            + Write First Blog Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const blogId = blog._id || blog.id;
            return (
              <div
                key={blogId}
                className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-emerald-500/30 hover:shadow-md"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
                    <Image
                      src={getImageUrl(blog.thumbnail)}
                      alt={blog.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600">
                    {blog.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-3">
                    {blog.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">
                    {formatDate(blog.createdAt, language)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blogs/${blogId}`}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      View / Edit
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(blogId, blog.title, e)}
                      disabled={deletingId === blogId}
                      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === blogId ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
