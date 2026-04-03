"use client";

import { useState, useEffect, useRef } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
} from "@/actions/contentActions";
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  ImageIcon,
  Loader2,
  ExternalLink,
  Pencil,
  X,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { cities } from "@/data/mock";
import Link from "next/link";
import Image from "next/image";

// Static city list from the fixed 14-city master data
const CITY_OPTIONS = cities
  .map((c) => ({ name: c.name, slug: c.slug }))
  .sort((a, b) => a.name.localeCompare(b.name));

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  citySlug: string;
  published: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  citySlug: "",
  published: true,
};

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Image upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getBlogs();
    if (res.success) {
      setBlogs(res.data || []);
    } else {
      setError(res.message || "Failed to load blogs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-generate slug from title (only if slug hasn't been manually edited)
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === slugify(prev.title) || prev.slug === ""
          ? slugify(title)
          : prev.slug,
    }));
  };

  // ── Image Upload ──────────────────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload/blog", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err: any) {
      setUploadError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ── Enter Edit Mode ───────────────────────────────────────────────────────
  const handleEdit = (blog: any) => {
    const citySlug =
      CITY_OPTIONS.find((c) => {
        try {
          const tags = JSON.parse(blog.tags || "[]");
          return tags.includes(c.name) || tags.includes(c.slug);
        } catch {
          return false;
        }
      })?.slug || "";

    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || "",
      citySlug,
      published: blog.published,
    });
    setEditingId(blog.id);
    setError("");
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  };

  // ── Save (Create or Update) ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const selectedCity = CITY_OPTIONS.find((c) => c.slug === form.citySlug);
      const tags = selectedCity
        ? JSON.stringify([selectedCity.name, selectedCity.slug])
        : "[]";

      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title) + "-" + Date.now(),
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || undefined,
        published: form.published,
        tags,
      };

      let res;
      if (editingId) {
        res = await updateBlog(editingId, payload);
      } else {
        res = await createBlog(payload);
      }

      if (!res.success) {
        throw new Error(res.message || "Operation failed");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Publish ────────────────────────────────────────────────────────
  const handleToggleStatus = async (id: string, published: boolean) => {
    const res = await updateBlogStatus(id, !published);
    if (res.success) {
      loadData();
    } else {
      alert(res.message || "Failed to update status.");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, title: string) => {
    if (
      confirm(
        `Delete "${title}" permanently?\n\nThis action cannot be undone.`
      )
    ) {
      const res = await deleteBlog(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message || "Failed to delete article.");
      }
    }
  };

  // ── City label from blog ──────────────────────────────────────────────────
  const getCityFromBlog = (blog: any) => {
    if (blog.city) return blog.city.name;
    try {
      const tags = JSON.parse(blog.tags || "[]");
      return tags[0] || "General";
    } catch {
      return "General";
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-nature-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading Blog Engine...
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-nature-900">
          Articles &amp; Traveler Stories
        </h1>
        <p className="text-nature-500 text-sm mt-0.5">
          Publish blogs attached to specific destinations. They automatically
          appear on that city&apos;s page and the homepage.
        </p>
      </div>

      {/* ── Create / Edit Blog Form ────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-nature-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
          {editingId ? (
            <>
              <Pencil className="w-5 h-5 text-purple-600" /> Edit Article
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-purple-600" /> Draft New Article
            </>
          )}
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ml-auto flex items-center gap-1.5 text-xs text-nature-400 hover:text-red-500 transition-colors font-medium"
            >
              <X className="w-3.5 h-3.5" /> Cancel Edit
            </button>
          )}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 mt-1.5 text-sm outline-none focus:border-purple-400 transition-colors"
                placeholder="e.g. Hidden Trails of Ziro Valley"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide">
                URL Slug <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 mt-1.5 text-sm outline-none font-mono focus:border-purple-400 transition-colors"
                placeholder="auto-generated from title"
              />
              <p className="text-[10px] text-nature-400 mt-1">
                Accessible at /blog/
                <span className="font-mono">{form.slug || "your-slug"}</span>
              </p>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-earth-500" />
                Destination City <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.citySlug}
                onChange={(e) =>
                  setForm({ ...form, citySlug: e.target.value })
                }
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 mt-1.5 text-sm outline-none focus:border-purple-400 transition-colors"
              >
                <option value="">— Select a city —</option>
                {CITY_OPTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {form.citySlug && (
                <p className="text-[10px] text-earth-600 mt-1 font-medium">
                  ✓ Blog will appear on{" "}
                  <span className="font-bold">
                    /destinations/{form.citySlug}
                  </span>
                </p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Cover Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />

              {form.coverImage ? (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-nature-200 group">
                  <div className="relative aspect-[16/7] w-full">
                    <Image
                      src={form.coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-nature-900 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, coverImage: "" }))
                      }
                      className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 w-full border-2 border-dashed border-nature-200 hover:border-purple-400 rounded-xl p-8 text-center transition-colors group disabled:opacity-60"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-nature-400">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-nature-400 group-hover:text-purple-500 transition-colors">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-semibold">
                        Click to upload image
                      </span>
                      <span className="text-xs text-nature-400">
                        JPG, PNG or WebP · Max 5MB
                      </span>
                    </div>
                  )}
                </button>
              )}

              {uploadError && (
                <p className="text-red-500 text-xs mt-1.5">{uploadError}</p>
              )}
            </div>

            {/* Publish Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setForm({ ...form, published: !form.published })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    form.published ? "bg-green-500" : "bg-nature-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.published ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-nature-700">
                  {form.published ? "Publish Immediately" : "Save as Draft"}
                </span>
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Excerpt */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide">
                Short Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 mt-1.5 text-sm outline-none focus:border-purple-400 transition-colors resize-none"
                placeholder="A brief summary shown on city pages and blog cards..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-xs font-bold text-nature-500 uppercase tracking-wide">
                Full Content (Markdown) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 mt-1.5 text-sm outline-none font-mono focus:border-purple-400 transition-colors resize-none"
                placeholder={"# Discovering the Wild\n\nWrite your article here using **Markdown** formatting...\n\n## Day 1\n\nYour story begins..."}
              />
              <p className="text-[10px] text-nature-400 mt-1">
                Supports standard Markdown — headings, bold, images, lists
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                <Pencil className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {saving
                ? "Saving..."
                : editingId
                ? "Update Article"
                : "Publish Article"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Blog List Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-nature-50/50 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-nature-900">All Articles</h2>
          <span className="ml-auto text-xs text-nature-500 font-medium">
            {blogs.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">
                  City
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className={`hover:bg-nature-50/50 transition-colors ${
                    editingId === blog.id ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.coverImage && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-nature-100 shrink-0 hidden sm:block">
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-nature-900 line-clamp-1">
                          {blog.title}
                        </p>
                        <p className="text-xs text-nature-400 font-mono mt-0.5">
                          /blog/{blog.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-nature-600 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-earth-500" />
                      {getCityFromBlog(blog)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-nature-500 text-xs hidden md:table-cell">
                    {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        blog.published
                          ? "bg-green-100 text-green-700"
                          : "bg-nature-200 text-nature-700"
                      }`}
                    >
                      {blog.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-nature-400 hover:text-nature-800 hover:bg-nature-100 transition-colors"
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(blog.id, blog.published)}
                        className={`p-2 rounded-lg transition-colors ${
                          blog.published
                            ? "text-blue-500 hover:bg-blue-50"
                            : "text-nature-400 hover:bg-nature-100"
                        }`}
                        title={blog.published ? "Unpublish" : "Publish"}
                      >
                        {blog.published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-nature-500"
                  >
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No articles yet. Write your first story above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
