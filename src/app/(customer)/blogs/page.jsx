// @ts-nocheck
"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/hooks/languageContext";
// Import modal component if available; otherwise use a placeholder
import { Modal as BlogDetailModal } from "@/components/modal";

// Dummy blog data – replace with real API data later
const demoBlogs = [
    {
        id: "b1",
        title: "Sustainable Fish Farming Practices",
        description: "Learn how to implement eco-friendly fish farming methods that boost yield and protect the environment.",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop",
        createdAt: "2024-03-15T10:00:00Z",
        videoUrl: null,
    },
    {
        id: "b2",
        title: "Top 5 Rice Varieties for Bangladeshi Soil",
        description: "A comprehensive guide to the most productive rice varieties suited for local conditions.",
        thumbnail: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=400&auto=format&fit=crop",
        createdAt: "2024-02-28T08:30:00Z",
        videoUrl: "https://example.com/video1.mp4",
    },
    {
        id: "b3",
        title: "Dairy Feed Innovations",
        description: "Explore the latest feed formulations that improve milk yield and animal health.",
        thumbnail: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=400&auto=format&fit=crop",
        createdAt: "2024-01-20T12:45:00Z",
        videoUrl: null,
    },
];

export default function BlogsPage() {
    const { t, language } = useLanguage();
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Using dummy data; in a real app replace with async data fetching
    const blogs = demoBlogs;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("blogPostsTitle")}</h1>
                <p className="text-xs text-gray-500 mt-1">{t("blogPostsSubtitle")}</p>
            </div>

            {blogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                    <p className="text-sm font-semibold text-gray-700">{t("noBlogPostsYet")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            onClick={() => setSelectedBlog(blog)}
                            className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                                {blog.thumbnail ? (
                                    <Image
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                                )}
                                {blog.videoUrl && (
                                    <span className="absolute top-3 right-3 rounded-full bg-red-600/90 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                                        ▶ Video Included
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <p className="text-[11px] font-medium text-gray-400">
                                    {new Date(blog.createdAt).toLocaleDateString(
                                        language === "bn" ? "bn-BD" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </p>
                                <h3 className="mt-1 text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-xs text-gray-500 flex-1">
                                    {blog.description}
                                </p>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-primary group-hover:underline">Read Article →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Blog Details Modal (non‑functional placeholder) */}
            {selectedBlog && (
                <BlogDetailModal isOpen={true} onClose={() => setSelectedBlog(null)} title={selectedBlog.title}>
                    {/* Modal content could be added here if desired */}
                </BlogDetailModal>
            )}
        </div>
    );
}
