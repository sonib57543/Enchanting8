import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VendorModalTrigger } from "@/components/ui/VendorModalTrigger";

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function DestinationStays({ params }: { params: { slug: string } }) {
  const city = cities.find(c => c.slug === params.slug);

  if (!city) {
    notFound();
  }

  const vendors = await prisma.vendor.findMany({
    where: {
      city: city.name,
      status: "APPROVED",
      isActive: true,
      serviceCategory: "HOTEL_HOMESTAY"
    }
  });

  const stays = vendors.map(vendor => {
    let details: any = {};
    try {
      details = vendor.vendorDetails ? JSON.parse(vendor.vendorDetails) : {};
    } catch (e) {}

    const primaryPhoto = (details.photos && details.photos.length > 0) 
      ? details.photos[0] 
      : vendor.image || city.heroImage || "https://images.unsplash.com/photo-1542314831-c53cd3816002?w=800&auto=format&fit=crop&q=80";

    let description = details.description || details.shortDescription;
    if (!description) {
      if (details.amenities && details.amenities.length > 0) {
        description = `A pleasant ${details.propertyType || 'stay'} in ${city.name} offering ${details.amenities.slice(0, 3).join(", ").toLowerCase()} and more.`;
      } else {
        description = `A welcoming ${details.propertyType || 'accommodation'} perfectly located in ${city.name}.`;
      }
    }

    return {
      id: vendor.id,
      vendorData: vendor,
      rawDetails: details,
      name: vendor.businessName,
      type: details.propertyType || details.type || "Accommodation",
      shortDescription: description,
      priceRange: details.startingPrice ? `Starting at ₹${details.startingPrice}/night` : "Contact for Pricing",
      image: primaryPhoto,
      amenities: Array.isArray(details.amenities) ? details.amenities : [],
      website: details.website || ""
    };
  });

  return (
    <div className="min-h-screen bg-nature-50 py-16">
      <div className="page-container">
        
        {/* Back Link */}
        <Link 
          href={`/destinations/${city.slug}`} 
          className="inline-flex items-center gap-2 text-nature-600 hover:text-earth-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {city.name}
        </Link>
        
        {/* Header */}
        <div className="mb-12 border-b border-nature-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-nature-900 mb-3 text-balance">
              Hotels & Homestays in {city.name}
            </h1>
            <p className="text-lg text-nature-600">
              Find the perfect place to rest after a day of exploration.
            </p>
          </div>
          <Link href="/vendor-register" className="btn btn-primary shrink-0">
            List Your Property
          </Link>
        </div>

        {/* Listings */}
        {stays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map(stay => (
              <div key={stay.id} className="glass-card overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group">
                <div 
                  className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${stay.image})` }}
                />
                <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-semibold text-nature-900 group-hover:text-nature-600 transition-colors line-clamp-1 pr-2">
                      {stay.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold bg-earth-100 text-earth-700 px-2 py-1 rounded shrink-0">
                      {stay.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-nature-600 mb-3 flex-1 line-clamp-2">
                    {stay.shortDescription}
                  </p>

                  {stay.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {stay.amenities.slice(0, 3).map((amen: string) => (
                        <span key={amen} className="text-[10px] font-semibold bg-nature-50 text-nature-600 px-2 py-1 rounded border border-nature-100">
                          {amen}
                        </span>
                      ))}
                      {stay.amenities.length > 3 && (
                        <span className="text-[10px] font-semibold bg-nature-50 text-nature-600 px-2 py-1 rounded border border-nature-100">
                          +{stay.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-auto border-t border-nature-100 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-nature-400 uppercase tracking-widest font-bold mb-0.5">Pricing</p>
                      <p className="text-earth-600 font-semibold text-sm">{stay.priceRange}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${stay.vendorData.phone}`} className="btn btn-outline text-xs h-8 px-3">
                        Contact
                      </a>
                      <VendorModalTrigger vendor={stay.vendorData} rawDetails={stay.rawDetails} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-nature-200 border-dashed">
            <h3 className="text-2xl font-serif text-nature-900 mb-2">No properties listed yet</h3>
            <p className="text-nature-500">Be the first to list a property in {city.name}.</p>
            <Link href="/vendor-register" className="btn btn-primary mt-6">Register as Vendor</Link>
          </div>
        )}

      </div>
    </div>
  );
}
