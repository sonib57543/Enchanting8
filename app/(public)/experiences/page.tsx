import Link from "next/link";
import { ExperienceCard } from "@/components/ui/ExperienceCard";

const experiences = [
  {
    id: "1",
    title: "Tribal Village Discovery",
    description: "Immerse yourself in the ancient traditions of the Apatani tribe. Stay in traditional bamboo houses and witness unique customs.",
    image: "/images/destinations/ziro.jpg",
    category: "Culture",
    duration: "3 Days"
  },
  {
    id: "2",
    title: "Brahmaputra River Rafting",
    description: "Tame the mighty Brahmaputra. An adrenaline-pumping journey through the scenic gorges of Arunachal Pradesh.",
    image: "/images/packages/arunachal-adventure.jpg",
    category: "Adventure",
    duration: "1 Day"
  },
  {
    id: "3",
    title: "Living Root Bridge Trek",
    description: "Walk across bridges grown over centuries. Explore the wettest place on earth and discover nature's architectural wonders.",
    image: "/images/destinations/cherrapunji.jpg",
    category: "Nature",
    duration: "6 Hours"
  }
];

export default function ExperiencesPage() {
  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-waterfall.png')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="page-container relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Unforgettable <span className="text-earth-400">Experiences</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Go beyond sightseeing. Immerse yourself in the vibrant culture and wild adventures of the North East.
          </p>
        </div>
      </section>

      {/* Experience Categories / Content */}
      <section className="py-24 bg-nature-50">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map(exp => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="page-container text-center">
          <h2 className="font-serif text-4xl font-bold text-nature-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-nature-600 mb-10 max-w-2xl mx-auto">
            Choose from our curated destinations and build your own unique North East experience.
          </p>
          <Link 
            href="/destinations"
            className="inline-block bg-earth-500 hover:bg-earth-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-xl hover:-translate-y-1"
          >
            Explore All Destinations
          </Link>
        </div>
      </section>
    </div>
  );
}
