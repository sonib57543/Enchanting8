import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plane, Train, Car, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default function HowToReachPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();
  const reach = city.howToReach;

  return (
    <div className="min-h-screen bg-nature-50">
      <div className="relative h-52 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/60" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">How to Reach {city.name}</h1>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {!reach ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-nature-300">
            <h3 className="text-2xl font-serif text-nature-900 mb-2">Travel Info Coming Soon</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {reach.byAir && (
              <div className="bg-white rounded-2xl border border-nature-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-nature-100 bg-blue-50">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><Plane className="w-6 h-6 text-blue-600" /></div>
                  <div><h3 className="font-serif text-xl font-semibold text-nature-900">By Air</h3><p className="text-sm text-nature-500">Nearest Airport</p></div>
                </div>
                <div className="p-6 space-y-3 text-sm text-nature-700">
                  <p><strong>Airport:</strong> {reach.byAir.nearestAirport}</p>
                  {reach.byAir.airlines && <p><strong>Airlines:</strong> {reach.byAir.airlines.join(", ")}</p>}
                  {reach.byAir.notes && <p className="text-nature-500 bg-blue-50 p-3 rounded-lg flex items-start gap-2"><Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />{reach.byAir.notes}</p>}
                </div>
              </div>
            )}

            {reach.byTrain && (
              <div className="bg-white rounded-2xl border border-nature-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-nature-100 bg-amber-50">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"><Train className="w-6 h-6 text-amber-600" /></div>
                  <div><h3 className="font-serif text-xl font-semibold text-nature-900">By Train</h3><p className="text-sm text-nature-500">Nearest Railway Station</p></div>
                </div>
                <div className="p-6 space-y-3 text-sm text-nature-700">
                  <p><strong>Station:</strong> {reach.byTrain.nearestStation}</p>
                  {reach.byTrain.trains && <p><strong>Key Trains:</strong> {reach.byTrain.trains.join(", ")}</p>}
                  {reach.byTrain.notes && <p className="text-nature-500 bg-amber-50 p-3 rounded-lg flex items-start gap-2"><Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{reach.byTrain.notes}</p>}
                </div>
              </div>
            )}

            {reach.byRoad && (
              <div className="bg-white rounded-2xl border border-nature-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-nature-100 bg-green-50">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><Car className="w-6 h-6 text-green-600" /></div>
                  <div><h3 className="font-serif text-xl font-semibold text-nature-900">By Road</h3><p className="text-sm text-nature-500">Distance from Guwahati: {reach.byRoad.distanceFromGuwahati}</p></div>
                </div>
                <div className="p-6 space-y-3 text-sm text-nature-700">
                  <div>
                    <strong>Routes:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-nature-600">
                      {reach.byRoad.routes.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                  {reach.byRoad.localTransport && (
                    <div>
                      <strong>Local Transport:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reach.byRoad.localTransport.map((t) => <span key={t} className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">{t}</span>)}
                      </div>
                    </div>
                  )}
                  {reach.byRoad.notes && <p className="text-nature-500 bg-green-50 p-3 rounded-lg flex items-start gap-2"><Info className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{reach.byRoad.notes}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
