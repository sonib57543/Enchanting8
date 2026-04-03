import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { GuideCard } from "@/components/cards/GuideCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function GuidesPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const vendors = await prisma.vendor.findMany({
    where: {
      city: city.name,
      status: "APPROVED",
      isActive: true,
      serviceCategory: "TOUR_GUIDE",
    }
  });

  const guides = vendors.map(vendor => {
    let details: any = {};
    try {
      details = vendor.vendorDetails ? JSON.parse(vendor.vendorDetails) : {};
    } catch(e) {}
    
    // Fallback logic
    const primaryPhoto = (details.photos && details.photos.length > 0) 
      ? details.photos[0] 
      : vendor.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80";

    const expertiseList = details.placesExpertise 
      ? details.placesExpertise.split(',').map((s:string) => s.trim()).filter(Boolean)
      : ["Local Tours"];

    const bioText = `Experienced ${details.gender?.toLowerCase() || ''} local guide covering ${details.placesExpertise || city.name}. ${details.verified === 'Yes' ? 'Locally verified professional.' : ''}`;

    return {
      id: vendor.id,
      cityId: city.id,
      name: vendor.businessName && vendor.businessName !== vendor.ownerName ? `${vendor.businessName} (${vendor.ownerName})` : vendor.ownerName,
      photo: primaryPhoto,
      languages: ["English", "Hindi", "Local"],
      specialization: expertiseList.length > 3 ? expertiseList.slice(0, 3) : expertiseList,
      experienceYears: details.experienceYears ? parseInt(details.experienceYears) : 3,
      pricePerDay: "Contact for Pricing",
      contactInfo: vendor.phone,
      rating: 5.0,
      bio: bioText,
      rawDetails: details,
      vendorData: vendor
    };
  });

  return (
    <div className="min-h-screen bg-nature-50 py-0">
      <div className="relative h-52 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/60" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Local Guides in {city.name}</h1>
          <p className="text-white/80 mt-1 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" />{city.state}</p>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {guides.length > 0 ? (
          <>
            <SectionHeader label="Verified Guides" title="Your Expert Local Guides" subtitle="Handpicked, experienced, and multilingual guides ready to make your trip unforgettable." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-nature-300">
            <h3 className="text-2xl font-serif text-nature-900 mb-2">No Guides Listed Yet</h3>
            <p className="text-nature-500">Are you a local guide in {city.name}?</p>
            <Link href="/vendor-register" className="inline-block mt-6 bg-earth-500 hover:bg-earth-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors">Register as Guide</Link>
          </div>
        )}
      </div>
    </div>
  );
}
