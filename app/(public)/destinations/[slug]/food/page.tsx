import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FoodCard } from "@/components/cards/FoodCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["All", "Cafe", "Restaurant", "Local Food", "Street Food", "Pub"];

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function FoodPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const vendors = await prisma.vendor.findMany({
    where: {
      city: city.name,
      status: "APPROVED",
      isActive: true,
      serviceCategory: "FOOD_CAFE",
    }
  });

  const places = vendors.map(vendor => {
    let details: any = {};
    try {
      details = vendor.vendorDetails ? JSON.parse(vendor.vendorDetails) : {};
    } catch(e) {}
    
    const primaryPhoto = (details.photos && details.photos.length > 0) 
      ? details.photos[0] 
      : vendor.image || city.heroImage || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80";

    const category = details.facilityType || details.type || details.category || "Restaurant";
    const specialtyText = details.description || details.specialty || `A popular dining spot in ${city.name}`;
    
    let cuisines = ["Local & Indian Cuisine"];
    if (Array.isArray(details.cuisine)) {
       cuisines = details.cuisine;
    } else if (details.cuisine) {
       cuisines = [details.cuisine];
    } else if (category === "Cafe" || category === "Pit spot") {
       cuisines = ["Beverages & Snacks"];
    } else if (category === "Street Food") {
       cuisines = ["Street Food", "Local Delicacies"];
    }

    return {
      id: vendor.id,
      cityId: city.id,
      name: vendor.businessName,
      image: primaryPhoto,
      category: category,
      cuisine: cuisines,
      specialty: specialtyText,
      priceRange: "Menu Based Pricing",
      openingHours: details.timings || details.openingHours || "Check with restaurant",
      rawDetails: details,
      vendorData: vendor
    };
  });

  return (
    <div className="min-h-screen bg-nature-50">
      <div className="relative h-52 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/60" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Food & Cafes in {city.name}</h1>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {places.length > 0 ? (
          <>
            <SectionHeader label="Dining" title={`Eat & Drink in ${city.name}`} subtitle="From smoky local kitchens to cozy hilltop cafes — where to find the best food." />
            <div className="flex gap-2 flex-wrap mb-8">
              {CATEGORIES.map((cat) => (
                <button key={cat} className={`px-4 py-1.5 rounded-full text-sm border font-medium transition-colors ${cat === "All" ? "bg-earth-500 text-white border-earth-500" : "bg-white text-nature-700 border-nature-200 hover:border-earth-400 hover:text-earth-600"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((p) => <FoodCard key={p.id} place={p} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-nature-300">
            <h3 className="text-2xl font-serif text-nature-900 mb-2">Dining Guide Coming Soon</h3>
            <p className="text-nature-500 text-sm">We&apos;re compiling the best eateries in {city.name}.</p>
            <Link href="/vendor-register" className="inline-block mt-6 bg-earth-500 hover:bg-earth-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors">
              Register Your Restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
