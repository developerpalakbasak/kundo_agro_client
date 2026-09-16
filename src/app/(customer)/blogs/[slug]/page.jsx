// @ts-nocheck
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getBlogBySlug } from "@/lib/api/blogs";
import { useLanguage } from "@/hooks/languageContext";

/* ─── Skeleton loader ─────────────────────────────────────────────────────── */
function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[420px] bg-gray-200 rounded-none" />
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-5">
        <div className="h-4 w-24 bg-gray-200 rounded-full" />
        <div className="h-9 w-3/4 bg-gray-200 rounded-lg" />
        <div className="h-9 w-1/2 bg-gray-200 rounded-lg" />
        <div className="h-4 w-40 bg-gray-200 rounded-full" />
        <div className="space-y-3 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-3 bg-gray-200 rounded-full ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Error / empty states ───────────────────────────────────────────────── */
function ErrorState({ message, onBack }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-5xl">🌿</div>
      <h2 className="text-xl font-bold text-gray-800">{message}</h2>
      <button
        onClick={onBack}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition"
      >
        ← Go back
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogBySlug(slug);
        // axios wraps body in `.data`; API wraps blog in `.data.data`
        setBlog(response.data?.data || response.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
        setError(err.message || "Error loading blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorState message={error} onBack={() => router.back()} />;
  if (!blog) return <ErrorState message={t("noBlogFound") || "Blog not found"} onBack={() => router.back()} />;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(
    language === "bn" ? "bn-BD" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <article className="min-h-screen bg-[#f8faf7]">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden bg-gray-900">
        {blog.thumbnail ? (
          <Image
            src={blog.thumbnail.startsWith("http") ? blog.thumbnail : `${process.env.NEXT_PUBLIC_API_URL}${blog.thumbnail}`}
            alt={blog.title}
            fill
            priority
            unoptimized
            className="object-cover opacity-75"
          />
        ) : (
          /* Decorative gradient fallback */
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d6a31] via-[#4c9a52] to-[#4f9a94]">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #ffffff33 0%, transparent 60%)" }} />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-2 hover:bg-white/25 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t("back") || "Back"}
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute top-5 right-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-2 hover:bg-white/25 transition-all duration-200"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </>
          )}
        </button>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-10">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block mb-3 rounded-full bg-primary/90 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1">
              Kundo Agro Blog
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
              {blog.title}
            </h1>
            <p className="mt-3 text-sm text-white/75 font-medium">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* ── Content area ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-10 space-y-8">

        {/* Description / lead */}
        {blog.description && (
          <p className="text-base md:text-lg text-gray-600 leading-relaxed border-l-4 border-primary pl-4 italic">
            {blog.description}
          </p>
        )}

        {/* Video embed */}
        {blog.videoUrl && (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400 font-medium">▶ Video</span>
            </div>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={blog.videoUrl}
                title={blog.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Rich prose content */}
        <div
          className="
            prose prose-sm sm:prose-base max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-primary prose-blockquote:text-gray-600
            prose-strong:text-gray-900
            prose-li:text-gray-700
            prose-code:bg-[#f1f7ee] prose-code:text-[#2d6a31] prose-code:rounded prose-code:px-1
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 pt-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-lg">🌿</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Back to blogs */}
        <div className="flex justify-between items-center pb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-[#2d6a31] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t("back") || "Back to Blogs"}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 text-primary text-sm font-semibold px-5 py-2 hover:bg-primary hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            {copied ? "Copied!" : "Share Article"}
          </button>
        </div>
      </div>
    </article>
  );
}
