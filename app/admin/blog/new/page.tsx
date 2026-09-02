"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  UploadCloud,
  Eye,
  Edit3,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Stand Fabrication");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [published, setPublished] = useState(true);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    // Auto generate clean slug
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    setSlug(generated);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title || !slug || !excerpt || !content) {
      setErrorMessage("Please fill in the title, slug, excerpt, and article content.");
      return;
    }

    setIsSaving(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/blog", {
        method: "POST",
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
        setErrorMessage(data.error || "Failed to publish article.");
        setIsSaving(false);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setErrorMessage("Network error saving article.");
      setIsSaving(false);
    }
  };

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
            Create New Journal Article
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? "Edit Mode" : "Preview Markdown"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Publishing..." : "Save Article"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Navigating DWTC & DEC Stand Guidelines 2026"
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
            />
          </div>

          {/* Slug & Category */}
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
                  placeholder="navigating-dwtc-guidelines"
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

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Cover Hero Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <UploadCloud className="w-4 h-4 text-[#00A7F5]" />
                <span>{isUploading ? "Uploading..." : "Upload Cover Image"}</span>
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
                  placeholder="Or paste image URL (e.g. /images/summit-keynote.jpg)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Executive Summary / Excerpt *
            </label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence overview for SEO snippets and social previews..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] resize-none"
            />
          </div>

          {/* Tags & Reading Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                Comma-Separated Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="DWTC, CNC Carpentry, Exhibition Stand"
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
                placeholder="e.g. 7 min read (leave blank to auto-calculate)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
              />
            </div>
          </div>

          {/* Main Article Content (Markdown) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Article Body Content (Markdown Supported) *
              </label>
              <span className="text-[11px] text-slate-400">Supports headers, lists, code, quotes</span>
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
                placeholder="Write article in Markdown or plain formatted text...&#10;&#10;## 1. Introduction&#10;Key regulatory updates for trade shows..."
                className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] resize-y"
              />
            )}
          </div>

          {/* Published Checkbox */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#003E95] focus:ring-[#003E95]"
              />
              <span className="text-xs font-bold text-slate-800">
                Publish Immediately to Public Journal
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Publish Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
