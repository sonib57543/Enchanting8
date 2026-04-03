import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Stories & Insights | Enchanting8",
  description: "Explore travel stories, hidden gems, tips, and authentic experiences from the heart of Northeast India.",
};

export default async function BlogListingPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { city: true },
  });

  return (
    <main className="min-h-screen bg-earth-50/50">
      {/* Hero Banner */}
      <section className="relative bg-nature-900 py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-waterfall.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-nature-900/80 to-nature-900/95" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-earth-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">Enchanting8 Journal</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Travel Stories<br />&amp; Insights
          </h1>
          <p className="text-nature-300 text-lg leading-relaxed max-w-xl mx-auto">
            Discover hidden stories, local wisdom, and authentic experiences from the enchanted Northeast.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-nature-200 shadow-sm">
              <div className="text-6xl mb-6">📖</div>
              <h2 className="font-serif text-2xl font-bold text-nature-900 mb-3">No stories yet</h2>
              <p className="text-nature-500 max-w-md mx-auto">
                Our team is working on some wonderful travel stories. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Featured first blog */}
              {blogs[0] && (
                <Link
                  href={`/blog/${blogs[0].slug}`}
                  className="group block mb-12 bg-white rounded-3xl overflow-hidden border border-nature-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[4/3] lg:aspect-auto min-h-[300px] bg-nature-100">
                      {blogs[0].coverImage ? (
                        <Image
                          src={blogs[0].coverImage}
                          alt={blogs[0].title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-nature-100 text-nature-300 text-6xl">🏔️</div>
                      )}
                      <div className="absolute top-4 left-4 bg-earth-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </div>
                    </div>
                    <div className="p-10 lg:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs font-medium text-nature-500 mb-4">
                        {blogs[0].city && (
                          <>
                            <span className="bg-nature-100 text-nature-700 px-2 py-0.5 rounded-full font-semibold">{blogs[0].city.name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{new Date(blogs[0].createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-nature-900 mb-4 group-hover:text-earth-600 transition-colors">
                        {blogs[0].title}
                      </h2>
                      <p className="text-nature-600 text-lg leading-relaxed mb-8 line-clamp-3">
                        {blogs[0].excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-earth-600 font-bold uppercase tracking-wider text-sm">
                        Read Full Story
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Remaining blogs grid */}
              {blogs.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.slice(1).map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-nature-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-nature-100">
                        {blog.coverImage ? (
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl bg-nature-100">🏔️</div>
                        )}
                        {blog.city && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-nature-900 uppercase tracking-wider shadow-sm">
                            {blog.city.name}
                          </div>
                        )}
                      </div>
                      <div className="p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-nature-500 mb-3">
                          <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>•</span>
                          <span>{blog.author}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-nature-900 mb-3 group-hover:text-earth-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-nature-600 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                        <div className="mt-auto flex items-center text-earth-600 font-bold text-sm uppercase tracking-wider">
                          Read More
                          <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
