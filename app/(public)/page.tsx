import Link from "next/link";
import { cities } from "@/data/mock";
import { PopularDestinationsSection } from "@/components/sections/PopularDestinationsSection";
import { HomepageBlogs } from "@/components/sections/HomepageBlogs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-waterfall.png')",
          }}
        />
        {/* High-contrast gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        {/* Text */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-10 lg:px-16 max-w-2xl">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-2xl">
            Discover the Magic<br />of North East India
          </h1>
          <p className="text-white/90 text-lg sm:text-xl font-light leading-relaxed mb-8 drop-shadow-md">
            Explore hidden gems and vibrant experiences of the Seven Sisters in India&apos;s enchanted frontier.
          </p>
          <Link
            href="/destinations"
            className="inline-block self-start bg-earth-500 hover:bg-earth-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-xl hover:scale-105"
          >
            Explore Destinations
          </Link>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ──────────────────────────────── */}
      <PopularDestinationsSection 
        cities={cities.filter(c => 
          ["ziro", "serchhip", "tamenglong", "kohima", "tawang", "aizawl", "shillong"].includes(c.slug)
        )} 
      />

      {/* ── WHY ENCHANTING8 ────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-10 bg-white border-y border-nature-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-earth-600 font-bold uppercase tracking-widest text-xs mb-3">The Enchanting8 Advantage</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-nature-900 mb-4">Why Travel With Us</h2>
            <p className="text-nature-600 text-lg max-w-2xl mx-auto">Discover the untouched beauty of Northeast India with a partner that values authenticity, community, and your safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Local Expertise", desc: "Our guides are locals who know the hidden trails, ancient stories, and best-kept secrets of their homeland.", icon: "🗺️" },
              { title: "Sustainable Travel", desc: "We prioritize homestays and community-led tours that directly benefit local tribes and preserve the ecosystem.", icon: "🌿" },
              { title: "Seamless Logistics", desc: "From ILP permits to mountain roads, we handle the complexities of Enchanting8 travel so you can focus on the view.", icon: "🚕" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-nature-50 border border-nature-200/50 hover:shadow-lg transition-all">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="font-serif text-2xl font-bold text-nature-900 mb-4">{item.title}</h3>
                <p className="text-nature-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST BLOGS ────────────────────────────────────────── */}
      <HomepageBlogs />

      {/* ── ABOUT SECTION ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-nature-900 mb-6">Our Mission</h2>
            <div className="w-20 h-1.5 bg-earth-500 mb-8 rounded-full" />
            <p className="text-lg text-nature-700 leading-relaxed mb-6">
              Enchanting8 is dedicated to unveiling the hidden treasures of the Seven Sisters. We believe in travel that enriches the soul and supports local communities.
            </p>
            <p className="text-lg text-nature-700 leading-relaxed">
              Our platform connects adventurous travelers with authentic experiences, ensuring that every journey into India&apos;s enchanted frontier is sustainable, respectful, and unforgettable.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <div 
                className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('/images/hero-waterfall.png')" }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── EXPERIENCES SECTION ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-10 bg-nature-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-nature-900 mb-4">Unique Experiences</h2>
            <p className="text-lg text-nature-600">Beyond sightseeing—connect with the spirit of the Northeast</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Tribal Festivals", desc: "Witness the vibrant colors and ancient traditions of the Hornbill and Ziro festivals.", icon: "🎭" },
              { title: "River Rafting", desc: "Conquer the mighty Brahmaputra and sub-tributaries for an adrenaline-fueled adventure.", icon: "🌊" },
              { title: "Living Root Bridges", desc: "Trek through lush rain forests to see the architectural marvels of the Khasi people.", icon: "🌉" }
            ].map((exp, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-nature-100 group">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform inline-block">{exp.icon}</div>
                <h3 className="font-serif text-2xl font-bold text-nature-900 mb-4">{exp.title}</h3>
                <p className="text-nature-600 leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <p className="text-earth-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">What We Offer</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-nature-900 mb-6">Our Services</h2>
              <p className="text-lg text-nature-700 mb-8">
                We handle the logistics, so you can focus on the discovery.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-nature-900 hover:bg-black text-white font-semibold px-8 py-3 rounded-full transition-all"
              >
                Get in Touch
              </Link>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Customized Itineraries", desc: "Tailor-made travel plans that fit your interests, budget, and pace.", icon: "📋" },
                { title: "Permit Assistance", desc: "Hassle-free processing of ILP and PAP permits for restricted areas.", icon: "🛂" },
                { title: "Local Guide Network", desc: "Access to a vetted network of expert guides and local hosts.", icon: "🫂" },
                { title: "Safety & Support", desc: "24/7 on-ground support for a worry-free travel experience.", icon: "🛡️" }
              ].map((service, i) => (
                <div key={i} className="flex gap-6 p-8 rounded-2xl bg-nature-50 border border-nature-100 hover:border-earth-300 transition-colors">
                  <div className="text-4xl shrink-0">{service.icon}</div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-nature-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-nature-600 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
