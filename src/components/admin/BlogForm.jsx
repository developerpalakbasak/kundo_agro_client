"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

export function BlogForm({ initialData = null, onSubmit, isEditing = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    videoUrl: initialData?.videoUrl || "",
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : (initialData?.tags || ""),
    isPublished: initialData?.isPublished ?? true,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (!formData.title.trim()) throw new Error("Blog title is required.");
      if (!formData.description.trim()) throw new Error("Short description is required.");
      if (!formData.content.trim()) throw new Error("Blog content is required.");
      if (!isEditing && !thumbnailFile && !thumbnailPreview) {
        throw new Error("Thumbnail image is required.");
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("content", formData.content);
      if (formData.videoUrl) data.append("videoUrl", formData.videoUrl);
      if (formData.tags) data.append("tags", formData.tags);
      data.append("isPublished", String(formData.isPublished));

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      if (onSubmit) {
        await onSubmit(data);
      }
      router.push("/admin/blogs");
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while saving the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          ⚠️ {errorMsg}
        </div>
      )}

      <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Blog Content</legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Blog Title *</span>
          <input
            type="text"
            name="title"
            required
            maxLength={150}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Best Practices for Fish Breeding & Seed Care"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Short Summary / Description *</span>
          <textarea
            name="description"
            required
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief summary for previews and cards..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Full Content *</span>
          <textarea
            name="content"
            required
            rows={8}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write full blog content here..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono text-xs"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Video Embed URL (Optional)</span>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Tags (Comma-separated)</span>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="fish, aquaculture, medicine"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-semibold text-gray-800">Publish immediately</span>
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-3" disabled={isSubmitting}>
        <legend className="text-sm font-bold text-gray-900">Featured Image / Thumbnail</legend>

        {thumbnailPreview && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 hover:border-emerald-600 hover:text-emerald-600">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="sr-only"
          />
          {thumbnailPreview ? "Click to change image" : "Click to upload featured blog image"}
        </label>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Blog Post" : "Publish Blog Post"}
        </button>
      </div>
    </form>
  );
}
