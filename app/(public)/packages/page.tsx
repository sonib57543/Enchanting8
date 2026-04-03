import { getApprovedPackages } from "@/actions/packageActions";
import { PackageCard } from "@/components/cards/PackageCard";
import { cities } from "@/data/mock";

// Get unique cities from the 14-city master list that are alphabetically sorted
const FILTER_CITIES = ["All", ...cities.map(c => c.name).sort()];

export default async function PackagesPage({ searchParams }: { searchParams: { city?: string } }) {
  // Use searchParams to optionally filter if the user clicked a quick link
  const res = await getApprovedPackages(searchParams.city);
  const packages = res.success ? res.data : [];

  return (
    <div className="min-h-screen bg-nature-50">
      <div className="bg-nature-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518182170546-076616fdcd87?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Explore Curated Packages</h1>
          <p className="text-lg md:text-xl text-nature-200 max-w-2xl mx-auto">
            Discover breathtaking multi-day itineraries crafted by our verified local operators exclusively for North-East India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Destination Filters */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <span className="text-xs font-bold text-nature-500 uppercase tracking-[0.3em]">Filter by Destination</span>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {FILTER_CITIES.map(c => (
              <a 
                key={c} 
                href={c === "All" ? "/packages" : `/packages?city=${c}`} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${(!searchParams.city && c === "All") || searchParams.city === c 
                  ? "bg-earth-500 text-white border-earth-500 shadow-lg shadow-earth-500/20 scale-105" 
                  : "bg-white text-nature-600 border-nature-200 hover:border-earth-300 hover:text-earth-600 hover:bg-earth-50"
                }`}
              >
                {c}
              </a>
            ))}
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-nature-100 shadow-sm">
            <h3 className="text-xl font-bold text-nature-900">No Packages Found</h3>
            <p className="text-nature-500 mt-2">Check back soon for new exciting itineraries!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg: any) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
