import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Tag } from "lucide-react";
import { SiteCard } from "@/components/cards/SiteCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default function TouristSitesPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();
  const sites = city.touristSites ?? [];

  return (
    <div className="min-h-screen bg-nature-50 py-12">
      {/* Hero Banner */}
      <div className="relative h-52 w-full mb-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/60" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Tourist Sites in {city.name}</h1>
          <p className="text-white/80 mt-1 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" />{city.state}</p>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {sites.length > 0 ? (
          <>
            <SectionHeader label={`${sites.length} sites`} title={`Discover ${city.name}`} subtitle="Explore the must-visit tourist attractions, natural wonders, and cultural landmarks." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => <SiteCard key={site.id} site={site} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-nature-300">
            <h3 className="text-2xl font-serif text-nature-900 mb-2">Sites Coming Soon</h3>
            <p className="text-nature-500">We&apos;re curating the best tourist sites for {city.name}.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-nature-900 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl mb-2">Plan a trip to {city.name}</h3>
          <p className="text-nature-300 text-sm mb-6">Let our curated packages handle permits, stays, and guided tours.</p>
          <Link href="/packages" className="inline-block bg-earth-500 hover:bg-earth-600 text-white font-medium px-8 py-3 rounded-full transition-colors">
            View Tour Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
