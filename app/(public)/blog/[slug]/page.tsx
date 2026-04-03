import { notFound } from "next/navigation";
import { getBlogs } from "@/actions/contentActions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Clock, User } from "lucide-react";

// For Server-Side Markdown Rendering
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export async function generateStaticParams() {
  const res = await getBlogs();
  if (!res.success || !res.data) return [];
  return res.data.map((blog: any) => ({
    slug: blog.slug,
  }));
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = await prisma.blog.findUnique({
    where: { slug: params.slug },
    include: { city: true },
  });

  if (!blog || !blog.published) {
    notFound();
  }

  const tags = parseTags(blog.tags);
  const readTime = estimateReadTime(blog.content);
  const backHref = blog.city ? `/destinations/${blog.city.slug}` : "/blog";
  const backLabel = blog.city ? blog.city.name : "All Stories";

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-nature-900">
        {/* Cover Image */}
        <div className="relative w-full h-[55vh] min-h-[380px]">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-nature-800 flex items-center justify-center">
              <span className="text-8xl opacity-30">🏔️</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-nature-900 via-nature-900/50 to-transparent" />
        </div>

        {/* Back button — positioned over image */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {backLabel}
          </Link>
        </div>

        {/* Title and Meta — below the image gradient */}
        <div className="px-4 sm:px-8 pb-14 pt-0 max-w-4xl mx-auto -mt-32 relative z-10">
          {blog.city && (
            <span className="inline-flex items-center gap-1.5 bg-earth-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <MapPin className="w-3 h-3" /> {blog.city.name}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── Article Body ─────────────────────────────────────────────────── */}
      <article className="max-w-4xl mx-auto px-4 sm:px-8 py-14">
        {/* Excerpt callout */}
        {blog.excerpt && (
          <p className="text-xl text-nature-600 leading-relaxed font-medium border-l-4 border-earth-400 pl-6 mb-12 italic">
            {blog.excerpt}
          </p>
        )}

        {/* Markdown Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-nature-900 prose-p:text-nature-700 prose-p:leading-relaxed prose-a:text-earth-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-earth-400 prose-blockquote:text-nature-600 prose-strong:text-nature-900 prose-li:text-nature-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-nature-100">
            <p className="text-xs font-bold uppercase tracking-widest text-nature-400 mb-4">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-nature-100 text-nature-700 rounded-full text-sm font-semibold hover:bg-earth-100 hover:text-earth-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-nature-100 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-nature-600 hover:text-earth-600 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Travel Stories
          </Link>
          {blog.city && (
            <Link
              href={`/destinations/${blog.city.slug}`}
              className="inline-flex items-center gap-2 bg-earth-500 hover:bg-earth-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              Explore {blog.city.name}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
