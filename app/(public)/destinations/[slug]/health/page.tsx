import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, AlertTriangle, Heart, Pill } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { VendorModalTrigger } from "@/components/ui/VendorModalTrigger";

const typeIcon: Record<string, React.ReactNode> = {
  "Hospital": <Heart className="w-5 h-5 text-red-500" />,
  "Clinic": <Heart className="w-5 h-5 text-orange-500" />,
  "Pharmacy": <Pill className="w-5 h-5 text-blue-500" />,
  "Primary Health Centre": <Heart className="w-5 h-5 text-green-500" />,
};

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function HealthPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const vendors = await prisma.vendor.findMany({
    where: {
      city: city.name,
      status: "APPROVED",
      isActive: true,
      serviceCategory: "HOSPITAL_PHARMACY",
    }
  });

  const hospitals = vendors.map(vendor => {
    let details: any = {};
    try {
      details = vendor.vendorDetails ? JSON.parse(vendor.vendorDetails) : {};
    } catch(e) {}
    
    // Safety handling for amenities array
    const amenitiesList = Array.isArray(details.amenities) ? details.amenities : [];

    return {
      id: vendor.id,
      cityId: city.id,
      vendorData: vendor,
      rawDetails: details,
      name: vendor.businessName,
      type: details.facilityType || "Clinic",
      address: details.directions || `${city.name}, ${vendor.state}`,
      contactInfo: vendor.phone,
      emergencyAvailable: amenitiesList.includes("Emergency") || amenitiesList.includes("Ambulance"),
      services: amenitiesList.length > 0 ? amenitiesList : ["Consultation"],
      openingHours: details.timings || "No timings listed"
    };
  });

  return (
    <div className="min-h-screen bg-nature-50">
      <div className="relative h-52 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/70" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Hospitals & Health in {city.name}</h1>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4 mb-8">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Emergency Numbers</h3>
            <div className="flex flex-wrap gap-4 text-sm text-red-700">
              <span>🆘 National Emergency: <strong>112</strong></span>
              <span>🏥 Ambulance: <strong>108</strong></span>
              <span>🚓 Police: <strong>100</strong></span>
              <span>🚒 Fire: <strong>101</strong></span>
            </div>
          </div>
        </div>

        {hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl border border-nature-100 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    {typeIcon[h.type]}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-nature-900">{h.name}</h3>
                    <span className="text-xs bg-nature-100 text-nature-700 px-2 py-0.5 rounded-full">{h.type}</span>
                  </div>
                  {h.emergencyAvailable && (
                    <span className="ml-auto text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">24H Emergency</span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-nature-600">
                  <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-earth-500 shrink-0 mt-0.5" />{h.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-earth-500" /><a href={`tel:${h.contactInfo}`} className="text-nature-700 hover:text-earth-600 font-medium">{h.contactInfo}</a></p>
                </div>
                {h.services && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {h.services.map((s: string) => (
                      <span key={s} className="text-xs bg-earth-50 text-earth-700 border border-earth-200 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-nature-100">
                  <VendorModalTrigger vendor={h.vendorData} rawDetails={h.rawDetails} className="w-full text-xs font-semibold bg-nature-50 border border-nature-200 text-nature-700 hover:bg-earth-50 hover:text-earth-700 hover:border-earth-200 py-2 rounded-xl transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-nature-300">
            <h3 className="text-xl font-serif text-nature-900 mb-2">Health Info Coming Soon</h3>
            <p className="text-nature-500 text-sm">We&apos;re verifying local health facilities for {city.name}. Always carry basic medicines when traveling to remote areas.</p>
          </div>
        )}

        {/* Travel Health Tips */}
        <div className="mt-10 bg-earth-50 border border-earth-200 rounded-2xl p-6">
          <h3 className="font-serif text-lg font-semibold text-nature-900 mb-4">🩺 Travel Health Tips for {city.name}</h3>
          <ul className="space-y-2 text-sm text-nature-700">
            <li>✓ Carry a basic first-aid kit including altitude sickness medication if heading to high-altitude areas.</li>
            <li>✓ Stay hydrated — mountain air at altitude can cause dehydration quickly.</li>
            <li>✓ Keep travel insurance documents and emergency contacts readily accessible.</li>
            <li>✓ Inform your guide of any medical conditions before the trip starts.</li>
            <li>✓ Bottled or purified water only — do not drink stream water directly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
