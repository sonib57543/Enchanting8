import { ServiceCard } from "@/components/ui/ServiceCard";
import Link from "next/link";

const mainServices = [
  {
    id: "1",
    title: "Expert Tour Guides",
    description: "Connect with certified local guides who breathe history and adventure. Available for specialized treks, cultural tours, and photography.",
    icon: "🗺️",
    features: ["Bilingual Guides", "First-Aid Certified", "Local Tribe Experts"]
  },
  {
    id: "2",
    title: "Authentic Stays",
    description: "From luxury tea estate bungalows to cozy village homestays, find the perfect base for your exploration.",
    icon: "🏡",
    features: ["Tea Estates", "Tribal Homestays", "Eco-Resorts"]
  },
  {
    id: "3",
    title: "Reliable Transport",
    description: "Navigate the mountain roads with ease. Professional drivers and well-maintained 4x4 vehicles at your service.",
    icon: "🚙",
    features: ["Mountain Expertise", "Airport Transfers", "Self-Drive Options"]
  }
];

const secondaryServices = [
  { title: "Restaurants", icon: "🍱", desc: "Curated local dining experiences." },
  { title: "Permit Support", icon: "🛂", desc: "ILP & PAP documentation assistance." },
  { title: "Emergency", icon: "🏥", desc: "Health & pharmacy support network." }
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-24 bg-nature-900 text-center">
        <div className="page-container">
          <p className="text-earth-400 font-bold uppercase tracking-widest text-xs mb-4">Support Every Step</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">Our Tourism Services</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Providing the ecosystem you need for a safe and hassle-free exploration of India&apos;s enchanted frontier.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {mainServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="border-t border-nature-100 pt-20">
            <h2 className="font-serif text-3xl font-bold text-nature-900 text-center mb-12">Additional Offerings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {secondaryServices.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-nature-50 border border-nature-100">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <h3 className="font-bold text-nature-900">{s.title}</h3>
                    <p className="text-sm text-nature-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-earth-50">
        <div className="page-container flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-serif text-4xl font-bold text-nature-900 mb-4">Custom Service Package?</h2>
            <p className="text-nature-600">Tell us your requirements and we&apos;ll build a custom service ecosystem for your tour.</p>
          </div>
          <Link href="/contact" className="bg-nature-900 text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-all">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
