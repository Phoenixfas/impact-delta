"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime?: string | null;
  published: boolean;
  author?: { name: string; email: string } | null;
  createdAt: string;
}

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article");
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  const categories = [
    "ALL",
    "Stand Fabrication",
    "Event Management",
    "AV & Production",
    "DWTC Guidelines",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Journal & Article Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#003E95] text-xs font-mono font-bold">
              {total} Articles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish technical guides, exhibition booth case studies, and corporate summit updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Article</span>
          </Link>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-[#003E95] text-white shadow-xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / Table */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Article Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Reading Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003E95]" />
                      <span>Loading articles...</span>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No articles found matching the filter.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">/blog/{post.slug}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#003E95] font-semibold text-[11px]">
                        {post.category}
                      </span>
                    </td>

                    {/* Reading Time */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {post.readingTime || "5 min read"}
                    </td>

                    {/* Published Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {post.published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {post.author?.name || "Impact Editorial"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                        title="View Live Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="inline-flex p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 text-[#003E95] hover:border-blue-200 transition-colors shadow-2xs"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-800">{page}</span> of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
