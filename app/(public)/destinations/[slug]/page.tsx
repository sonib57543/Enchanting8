import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Calendar, Info, Navigation2, Camera, BookOpen,
  Plane, Train, Car, Star, ChevronRight, ShieldCheck,
  Utensils, Compass, Building2, Heart, HelpCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CityVendors } from "@/components/sections/CityVendors";
import { getApprovedPackages } from "@/actions/packageActions";
import { getCityBlogsForPublic } from "@/actions/contentActions";
import { cities } from "@/data/mock";

// ── Static params from mock data (all 14 cities always work) ──────────────────
export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export default async function DestinationDetail({ params }: { params: { slug: string } }) {
  // Primary: resolve city from mock data (guaranteed to work for all 14 cities)
  const city = cities.find((c) => c.slug === params.slug);

  if (!city) {
    notFound();
  }

  // Secondary: fetch dynamic DB data in parallel (these can be empty - never cause 404)
  const [blogsRes, pkgsRes] = await Promise.all([
    getCityBlogsForPublic(city.name),
    getApprovedPackages(city.name),
  ]);

  const cityBlogs = blogsRes.success ? blogsRes.data : [];
  const cityPackages = pkgsRes.success ? pkgsRes.data : [];

  const heroSrc = city.heroImage || "https://images.unsplash.com/photo-1626024197945-38f32ac9fde4?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-nature-50">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSrc})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="page-container relative z-10">
            <Breadcrumbs className="mb-4 text-white/80" />
            <div className="flex flex-wrap gap-2 mb-4">
              {city.featured && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/30">
                  ✦ Featured Destination
                </span>
              )}
              {city.permitRequired && (
                <span className="px-3 py-1 bg-amber-500/80 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide">
                  <ShieldCheck className="w-3 h-3 inline mr-1" />Permit Required
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-2 font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] text-white">
              {city.name}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <MapPin className="w-6 h-6 shrink-0" /> {city.state}
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick Facts Strip ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-nature-200 sticky top-16 z-40 shadow-sm overflow-x-auto">
        <div className="page-container py-4 flex items-center justify-between min-w-max gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-nature-500 font-medium uppercase tracking-wider">Best Time</p>
              <p className="font-semibold text-nature-900">{city.bestTimeToVisit || "Oct – May"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-nature-500 font-medium uppercase tracking-wider">Permit</p>
              <p className="font-semibold text-nature-900">{city.permitRequired ? "Required" : "Not Required"}</p>
            </div>
          </div>

          <div className="flex gap-3 ml-auto">
            <Link href={`#packages`} className="btn btn-primary">View Packages</Link>
            <Link href={`/contact`} className="btn btn-outline bg-white">Enquire Now</Link>
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ─────────────────────────────────────────── */}
      <div className="page-container py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Main Content */}
        <div className="lg:col-span-2 space-y-16">

          {/* Overview */}
          <section>
            <h2 className="text-3xl font-serif text-nature-900 mb-6">Overview</h2>
            <div className="prose prose-lg text-nature-700 font-serif leading-relaxed">
              <p>{city.longDescription || city.shortDescription}</p>
            </div>

            {/* Tags */}
            {city.tags && city.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {city.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-earth-50 border border-earth-200 text-earth-700 text-sm font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Local Tips */}
            {city.localTips && city.localTips.length > 0 && (
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-serif text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" /> Local Tips
                </h3>
                <ul className="space-y-2">
                  {city.localTips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5 shrink-0">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Discover Categories Grid */}
          <section>
            <h2 className="text-3xl font-serif text-nature-900 mb-6 flex items-center gap-3">
              <Navigation2 className="w-8 h-8 text-earth-500" />
              Discover {city.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "Tour Packages", href: `#packages`, icon: <Camera className="w-6 h-6 text-earth-500" /> },
                { title: "Tourist Sites", href: `/destinations/${city.slug}/tourist-sites`, icon: <MapPin className="w-6 h-6 text-earth-500" /> },
                { title: "Hotels & Stays", href: `/destinations/${city.slug}/stay`, icon: <Building2 className="w-6 h-6 text-earth-500" /> },
                { title: "Local Guides", href: `/destinations/${city.slug}/guides`, icon: <Compass className="w-6 h-6 text-earth-500" /> },
                { title: "Food & Cafes", href: `/destinations/${city.slug}/food`, icon: <Utensils className="w-6 h-6 text-earth-500" /> },
                { title: "How to Reach", href: `/destinations/${city.slug}/how-to-reach`, icon: <Navigation2 className="w-6 h-6 text-earth-500" /> },
                { title: "Hospitals", href: `/destinations/${city.slug}/health`, icon: <Heart className="w-6 h-6 text-earth-500" /> },
              ].map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all gap-3"
                >
                  {cat.icon}
                  <span className="font-medium text-nature-800 group-hover:text-nature-600 text-sm">{cat.title}</span>
                  <ChevronRight className="w-4 h-4 text-nature-400 group-hover:text-earth-500 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* Tourist Sites Preview */}
          {city.touristSites && city.touristSites.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-serif text-nature-900">Top Tourist Sites</h2>
                <Link href={`/destinations/${city.slug}/tourist-sites`} className="text-sm font-medium text-earth-600 hover:text-earth-800 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {city.touristSites.slice(0, 4).map((site) => (
                  <div key={site.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all">
                    <div
                      className="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${site.image})` }}
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif text-lg font-bold text-nature-900">{site.name}</h3>
                        <span className="text-xs font-semibold bg-earth-100 text-earth-700 px-2 py-1 rounded shrink-0">{site.category}</span>
                      </div>
                      <p className="text-sm text-nature-600 line-clamp-2">{site.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-nature-500">
                        {site.timings && <span>🕐 {site.timings}</span>}
                        {site.entryFee && <span>🎟️ {site.entryFee}</span>}
                        {site.idealDuration && <span>⏱️ {site.idealDuration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How to Reach Preview */}
          {city.howToReach && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-serif text-nature-900">How to Reach</h2>
                <Link href={`/destinations/${city.slug}/how-to-reach`} className="text-sm font-medium text-earth-600 hover:text-earth-800 flex items-center gap-1">
                  Full details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {city.howToReach.byAir && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-nature-900">By Air</h3>
                    <p className="text-xs text-nature-600">{city.howToReach.byAir.nearestAirport}</p>
                  </div>
                )}
                {city.howToReach.byTrain && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Train className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-nature-900">By Train</h3>
                    <p className="text-xs text-nature-600">{city.howToReach.byTrain.nearestStation}</p>
                  </div>
                )}
                {city.howToReach.byRoad && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-nature-900">By Road</h3>
                    <p className="text-xs text-nature-600">From Guwahati: {city.howToReach.byRoad.distanceFromGuwahati}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Blogs from Admin (Dynamic DB data) */}
          {cityBlogs.length > 0 && (
            <section>
              <h2 className="text-3xl font-serif text-nature-900 mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-earth-500" />
                Stories from {city.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cityBlogs.map((blog: any) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block glass-card overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div
                      className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${blog.coverImage || "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop"})` }}
                    />
                    <div className="p-6">
                      <p className="text-xs font-bold text-earth-600 uppercase tracking-wider mb-2">
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <h3 className="font-serif text-xl font-bold text-nature-900 mb-2 group-hover:text-earth-700 transition-colors">{blog.title}</h3>
                      <p className="text-nature-600 text-sm line-clamp-2">{blog.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {city.faqs && city.faqs.length > 0 && (
            <section>
              <h2 className="text-3xl font-serif text-nature-900 mb-6 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-earth-500" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {city.faqs.map((faq) => (
                  <div key={faq.id} className="glass-card p-6">
                    <h3 className="font-serif font-bold text-nature-900 mb-2">{faq.question}</h3>
                    <p className="text-nature-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-8">

          {/* Packages Widget */}
          <div className="glass-card p-6 sticky top-40" id="packages">
            <h3 className="font-serif text-xl mb-4 text-nature-900 border-b border-nature-200 pb-2">
              Popular Packages
            </h3>
            {cityPackages.length > 0 ? (
              <>
                <div className="space-y-4">
                  {cityPackages.slice(0, 3).map((pkg: any) => {
                    let img = "/placeholder-package.jpg";
                    try { img = JSON.parse(pkg.images || "[]")[0] || img; } catch {}
                    return (
                      <Link href={`/packages/${pkg.slug}`} key={pkg.id} className="group block bg-white rounded-lg p-3 border border-nature-100 hover:border-earth-300 transition-colors">
                        <div className="flex gap-4">
                          <div
                            className="w-20 h-20 rounded-md bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                          <div>
                            <h4 className="font-medium text-nature-900 text-sm line-clamp-2 group-hover:text-nature-600">{pkg.title}</h4>
                            <p className="text-xs text-nature-500 mt-1">{pkg.durationDays}D / {pkg.durationNights}N</p>
                            <p className="text-earth-600 font-bold text-sm mt-1">₹{pkg.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href={`/packages?city=${city.name}`} className="block text-center mt-4 text-sm font-medium text-nature-600 hover:text-nature-900">
                  View all packages →
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-nature-500 text-sm">No packages yet for {city.name}.</p>
                <Link href="/packages" className="text-earth-600 text-sm font-medium hover:underline mt-2 block">Browse all packages →</Link>
              </div>
            )}
          </div>

          {/* Stay Preview */}
          {city.stays && city.stays.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4 border-b border-nature-200 pb-2">
                <h3 className="font-serif text-xl text-nature-900">Places to Stay</h3>
                <Link href={`/destinations/${city.slug}/stay`} className="text-xs text-earth-600 hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-3">
                {city.stays.slice(0, 2).map((stay) => (
                  <div key={stay.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${stay.image})` }} />
                    <div>
                      <p className="font-medium text-sm text-nature-900">{stay.name}</p>
                      <p className="text-xs text-nature-500">{stay.type} · {stay.priceRange}</p>
                      {stay.rating && (
                        <p className="text-xs text-amber-600 font-bold">★ {stay.rating} ({stay.reviewCount} reviews)</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guide Preview */}
          {city.guides && city.guides.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4 border-b border-nature-200 pb-2">
                <h3 className="font-serif text-xl text-nature-900">Local Guides</h3>
                <Link href={`/destinations/${city.slug}/guides`} className="text-xs text-earth-600 hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-3">
                {city.guides.slice(0, 2).map((guide) => (
                  <div key={guide.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border-2 border-earth-200" style={{ backgroundImage: `url(${guide.photo})` }} />
                    <div>
                      <p className="font-medium text-sm text-nature-900">{guide.name}</p>
                      <p className="text-xs text-nature-500">{guide.languages?.join(", ")}</p>
                      <p className="text-xs text-earth-600 font-bold">{guide.pricePerDay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permit Info  */}
          {city.permitRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <h3 className="font-bold text-amber-900">Permit Required</h3>
              </div>
              <p className="text-sm text-amber-800">
                An Inner Line Permit (ILP) is required to visit {city.name}.
              </p>
              <Link href={`/destinations/${city.slug}/permits`} className="mt-3 text-xs text-amber-700 font-bold hover:underline block">
                Permit Info & How to Apply →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Approved Vendors Section (Full Width, Dynamic from DB) ─────────── */}
      <CityVendors cityName={city.name} />
    </div>
  );
}
