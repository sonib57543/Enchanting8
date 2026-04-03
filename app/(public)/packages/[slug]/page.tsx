import { getPackageBySlug, getApprovedPackages } from "@/actions/packageActions";
import { notFound } from "next/navigation";
import { MapPin, Clock, CheckCircle2, XCircle, ChevronDown, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PackageEnquiryTrigger } from "@/components/ui/PackageEnquiryTrigger";
import { PackageCard } from "@/components/cards/PackageCard";

export default async function PackageDetailsPage({ params }: { params: { slug: string } }) {
  const res = await getPackageBySlug(params.slug);
  if (!res.success || !res.data) notFound();
  const pkg = res.data;

  // Fetch related packages in the same city (excluding current one)
  const pkgsRes = await getApprovedPackages(pkg.city);
  const relatedPackages = pkgsRes.success 
    ? pkgsRes.data.filter((p: any) => p.id !== pkg.id).slice(0, 3) 
    : [];

  let images = [], includes = [], excludes = [], highlights = [], destinations = [];
  try {
    images = JSON.parse(pkg.images || "[]");
    includes = JSON.parse(pkg.includes || "[]");
    excludes = JSON.parse(pkg.excludes || "[]");
    highlights = JSON.parse(pkg.highlights || "[]");
    destinations = JSON.parse(pkg.destinations || "[]");
  } catch (e) {}

  const heroImage = images[0] || "/placeholder-package.jpg";

  return (
    <div className="min-h-screen bg-nature-50 pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-nature-900/90 via-nature-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="text-white max-w-3xl animate-in slide-in-from-left-4 duration-700">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-earth-500 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                <div className="flex items-center gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-earth-300" /> {pkg.city}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">{pkg.title}</h1>
              <p className="text-lg text-nature-200 line-clamp-2 md:line-clamp-none leading-relaxed">{pkg.description}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shrink-0 md:w-80 shadow-2xl animate-in slide-in-from-right-4 duration-700">
              <p className="text-nature-200 text-sm font-bold uppercase tracking-widest mb-1">Starting From</p>
              <div className="text-4xl font-bold text-white mb-6">₹{pkg.price.toLocaleString()}</div>
              
              <PackageEnquiryTrigger
                packageTitle={pkg.title}
                vendorName={pkg.vendor?.businessName ?? "Verified Operator"}
                packagePrice={pkg.price}
                className="w-full flex items-center justify-center gap-2 bg-earth-500 hover:bg-earth-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              />

              <p className="text-center text-xs text-nature-300 mt-3 font-medium">Operated by {pkg.vendor?.businessName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Highlights */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-nature-100">
            <h2 className="text-2xl font-serif font-bold text-nature-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-earth-500 rounded-full" />Key Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-nature-50 p-4 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-earth-500 shrink-0 mt-0.5" />
                  <span className="text-nature-700 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-nature-100">
            <h2 className="text-2xl font-serif font-bold text-nature-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-earth-500 rounded-full" />Daily Itinerary
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-nature-200 before:to-transparent">
              {pkg.itinerary?.map((day: any, i: number) => (
                <div key={day.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-earth-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    D{day.day}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-nature-50 p-6 rounded-2xl border border-nature-100 shadow-sm">
                    <h3 className="font-bold text-lg text-nature-900 mb-2">{day.title}</h3>
                    <p className="text-nature-600 text-sm leading-relaxed">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Includes / Excludes */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-nature-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-serif font-bold text-nature-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" /> What&apos;s Included
              </h2>
              <ul className="space-y-3">
                {includes.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-nature-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5 opacity-70" />{inc}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-nature-900 mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" /> What&apos;s Excluded
              </h2>
              <ul className="space-y-3">
                {excludes.map((exc: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-nature-700 text-sm font-medium">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 opacity-70" />{exc}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-nature-100 sticky top-28">
            <h3 className="text-lg font-serif font-bold text-nature-900 mb-6">Tour Operator Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-nature-50 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-earth-100 text-earth-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {pkg.vendor?.businessName?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-nature-900">{pkg.vendor?.businessName}</p>
                  <p className="text-xs text-nature-500 font-medium">{pkg.vendor?.city}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-sm font-medium text-nature-700 p-1">
                  <Mail className="w-5 h-5 text-nature-400 shrink-0" />
                  <span className="break-all">{pkg.vendor?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-nature-700 p-1">
                  <Phone className="w-5 h-5 text-nature-400 shrink-0" />
                  {pkg.vendor?.phone}
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-nature-100">
                <PackageEnquiryTrigger
                  packageTitle={pkg.title}
                  vendorName={pkg.vendor?.businessName ?? "Verified Operator"}
                  packagePrice={pkg.price}
                  buttonText="Contact Operator"
                  className="w-full flex items-center justify-center gap-2 bg-nature-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                />
              </div>
            </div>
          </div>
          
          {/* Covered Destinations Mini Map / Tags */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-nature-100">
            <h3 className="text-lg font-serif font-bold text-nature-900 mb-4">Destinations Covered</h3>
            <div className="flex flex-wrap gap-2">
              {destinations.map((d: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-nature-50 border border-nature-200 text-nature-700 text-xs font-bold rounded-lg">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-earth-600 font-bold uppercase tracking-widest text-xs mb-3">Customized for You</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-nature-900">Similar Experiences in {pkg.city}</h2>
            </div>
            <Link href={`/packages?city=${pkg.city}`} className="hidden md:flex items-center gap-2 text-earth-600 font-bold hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPackages.map((rp: any) => (
              <PackageCard key={rp.id} pkg={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
