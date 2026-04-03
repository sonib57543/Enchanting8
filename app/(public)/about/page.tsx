import { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { InfoCard } from "@/components/ui/InfoCard";
import Link from "next/link";
import { cities } from "@/data/mock";

export const metadata: Metadata = {
  title: "About Enchanting8 | Discover Northeast India",
  description: "Learn about Enchanting8's mission to promote sustainable travel and support local communities across the Seven Sisters of Northeast India.",
};

export default function AboutPage() {
  const offerings = [
    { title: "Tour Packages", icon: "📦", desc: "Curated itineraries covering the most iconic and offbeat destinations." },
    { title: "Local Tour Guides", icon: "🗺️", desc: "Expert locals to give you deep insights into tribal culture and history." },
    { title: "Hotels & Homestays", icon: "🏡", desc: "From luxury resorts to authentic tribal homestays." },
    { title: "Local Food", icon: "🍛", desc: "Discover the unique flavors and culinary traditions of each state." },
    { title: "Cultural Experiences", icon: "🎭", desc: "Festival tours, craft workshops, and village immersion programs." },
    { title: "Travel Assistance", icon: "🛂", desc: "ILP support, transport booking, and 24/7 on-ground help." }
  ];

  const featuredDestinations = cities.slice(0, 3);

  return (
    <div className="pt-20">
      <HeroSection 
        title="About Enchanting8"
        subtitle="Discover the beauty, culture, and experiences of Northeast India"
        image="/images/hero-waterfall.png"
        ctaText="Explore Destinations"
        ctaLink="/destinations"
      />

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-earth-600 font-bold uppercase tracking-widest text-xs mb-4">Our Mission</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-nature-900 mb-8">Unveiling the Enchanted Frontier</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
              <div className="p-6">
                <div className="text-3xl mb-4">🏔️</div>
                <h4 className="font-bold text-nature-900 mb-2">Promoting Tourism</h4>
                <p className="text-nature-600 text-sm">Putting Northeast India on the global map as a premier destination for conscious travelers.</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-4">🔍</div>
                <h4 className="font-bold text-nature-900 mb-2">Hidden Secrets</h4>
                <p className="text-nature-600 text-sm">Helping travelers discover untrodden trails and authentic local experiences away from crowds.</p>
              </div>
              <div className="p-6">
                <div className="text-3xl mb-4">🫂</div>
                <h4 className="font-bold text-nature-900 mb-2">Local Support</h4>
                <p className="text-nature-600 text-sm">Directly benefiting tribal communities and local vendors through fair tourism practices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-nature-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-nature-900 mb-4">What We Offer</h2>
            <p className="text-lg text-nature-600">A complete ecosystem for your Northeast exploration</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering, i) => (
              <InfoCard 
                key={i}
                title={offering.title}
                icon={offering.icon}
                description={offering.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl font-bold text-nature-900 mb-4">Featured Destinations</h2>
              <p className="text-nature-600">Explore our curated selection of must-visit places across the Seven Sisters.</p>
            </div>
            <Link href="/destinations" className="text-earth-600 font-bold hover:underline mb-2">View All Destinations →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((city) => (
              <div key={city.id} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${city.heroImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 w-full">
                  <p className="text-earth-400 text-xs font-bold uppercase tracking-widest mb-1">{city.state}</p>
                  <h3 className="text-white font-serif text-2xl font-bold mb-4">{city.name}</h3>
                  <Link 
                    href={`/destinations/${city.slug}`}
                    className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-bold px-6 py-2 rounded-full hover:bg-white hover:text-nature-900 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Local */}
      <section className="py-24 bg-nature-900 text-white">
        <div className="page-container flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8">Supporting Local Communities</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              We empower local guides, small homestays, and neighborhood restaurateurs. By choosing Enchanting8, you directly contribute to the preservation of tribal heritage and the economic growth of remote regions.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <p className="text-3xl font-bold text-earth-400">500+</p>
                <p className="text-xs font-medium uppercase tracking-widest text-white/50">Local Vendors</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <p className="text-3xl font-bold text-earth-400">100+</p>
                <p className="text-xs font-medium uppercase tracking-widest text-white/50">Homestays</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center">
            <h3 className="text-2xl font-serif font-bold mb-6 text-white">Are you a Local Vendor?</h3>
            <p className="text-white/80 mb-10">Join our network and showcase your services to travelers from around the world.</p>
            <Link 
              href="/vendor-register"
              className="inline-block bg-earth-500 hover:bg-earth-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-xl"
            >
              Register as Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-earth-50">
        <div className="page-container text-center">
          <h2 className="font-serif text-4xl font-bold text-nature-900 mb-6">Start Your Journey Today</h2>
          <p className="text-lg text-nature-600 mb-10 max-w-2xl mx-auto">
            Plan your untamed adventure into the heart of the Seven Sisters with India&apos;s most trusted tourism platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/destinations" className="w-[200px] bg-nature-900 text-white py-4 rounded-full font-bold shadow-lg hover:bg-black transition-all">
              Explore Now
            </Link>
            <Link href="/contact" className="w-[200px] bg-white text-nature-900 border border-nature-200 py-4 rounded-full font-bold shadow-sm hover:bg-nature-50 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
