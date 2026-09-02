"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Stand Fabrication");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          const p = data.post;
          setTitle(p.title);
          setSlug(p.slug);
          setCategory(p.category);
          setExcerpt(p.excerpt);
          setContent(p.content);
          setCoverImage(p.coverImage || "");
          setReadingTime(p.readingTime || "");
          setPublished(p.published);
          if (Array.isArray(p.tags)) {
            setTagsInput(p.tags.join(", "));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch post:", err);
        setLoading(false);
      });
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.file) {
        setCoverImage(data.file.url);
      } else {
        setErrorMessage(data.error || "Failed to upload image");
      }
    } catch {
      setErrorMessage("Network error during file upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title || !slug || !excerpt || !content) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          content,
          coverImage: coverImage || null,
          tags,
          readingTime: readingTime || undefined,
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update article.");
        setIsSaving(false);
        return;
      }

      setSuccessMessage("Article updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsSaving(false);
    } catch {
      setErrorMessage("Network error updating article.");
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/blog");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article");
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-[#003E95] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#003E95] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Articles</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Edit Journal Article
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? "Edit Mode" : "Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
            title="Delete Article"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs">
                <span className="text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent font-mono text-slate-800 focus:outline-none ml-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
              >
                <option value="Stand Fabrication">Stand Fabrication</option>
                <option value="Event Management">Event Management</option>
                <option value="AV & Production">AV & Production</option>
                <option value="DWTC Guidelines">DWTC Guidelines</option>
                <option value="Corporate Summits">Corporate Summits</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Cover Hero Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <UploadCloud className="w-4 h-4 text-[#00A7F5]" />
                <span>{isUploading ? "Uploading..." : "Replace Cover Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Cover image URL"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Executive Summary / Excerpt *
            </label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Comma-Separated Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Article Body Content (Markdown Supported) *
              </label>
            </div>

            {isPreviewMode ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 min-h-[320px] prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                {content || "No content entered yet."}
              </div>
            ) : (
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] resize-y"
              />
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#003E95] focus:ring-[#003E95]"
              />
              <span className="text-xs font-bold text-slate-800">
                Published & Visible to Public
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
