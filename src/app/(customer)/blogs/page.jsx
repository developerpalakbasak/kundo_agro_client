// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/api/blogs";
import { useLanguage } from "@/hooks/languageContext";

function BlogCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100 animate-pulse" />

            <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-medium text-gray-400 rounded bg-gray-200 text-transparent animate-pulse w-fit select-none">
                    September 10, 2026
                </p>
                <h3 className="mt-1 text-base font-bold rounded bg-gray-200 text-transparent animate-pulse line-clamp-2 select-none">
                    Placeholder Title That Wraps Onto Two Full Lines Here
                </h3>
                <p className="mt-2 text-xs rounded bg-gray-200 text-transparent animate-pulse line-clamp-3 flex-1 select-none">
                    Placeholder description text that fills out three full lines so the skeleton matches the real card height exactly without any guesswork involved at all here.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold rounded bg-gray-200 text-transparent animate-pulse w-fit select-none">
                        Read Article →
                    </span>
                </div>
            </div>
        </div>
    );
}

function BlogGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default function BlogsPage() {
    const { t, language } = useLanguage();

    // Fetch blogs from API
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogs();
                // axios wraps body in `.data`; API wraps list in `.data.data`
                setBlogs(response.data?.data || response.data || []);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
                setError(err.message || 'Error fetching blogs');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);


    return (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("blogPostsTitle")}</h1>
                <p className="text-xs text-gray-500 mt-1">{t("blogPostsSubtitle")}</p>
            </div>

            {loading ? (
                <BlogGridSkeleton count={6} />
            ) : blogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                    <p className="text-sm font-semibold text-gray-700">{t("noBlogPostsYet")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                            <div className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
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
                        </Link>
                    ))}
                </div>
            )}

       
        </div>
    );
}