import { cities } from "@/data/mock";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2, FileText, ExternalLink } from "lucide-react";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default function PermitsPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const faqs = (city.faqs ?? []).filter(f => f.question.toLowerCase().includes("permit") || f.question.toLowerCase().includes("ilp") || f.question.toLowerCase().includes("safe"));
  const allFaqs = city.faqs ?? [];

  return (
    <div className="min-h-screen bg-nature-50">
      <div className="relative h-52 w-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${city.heroImage})` }} />
        <div className="absolute inset-0 bg-nature-900/60" />
        <div className="relative z-10 h-full flex flex-col justify-end page-container pb-8">
          <Link href={`/destinations/${city.slug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to {city.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Permits & Travel Info for {city.name}</h1>
        </div>
      </div>

      <div className="page-container py-6">
        <Breadcrumbs className="mb-4" />
        {/* Permit Status Banner */}
        <div className={`rounded-2xl p-6 mb-8 border flex items-start gap-4 ${city.permitRequired ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          {city.permitRequired
            ? <AlertTriangle className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
            : <CheckCircle2 className="w-7 h-7 text-green-500 shrink-0 mt-0.5" />
          }
          <div>
            <h3 className={`font-semibold text-lg mb-1 ${city.permitRequired ? "text-amber-800" : "text-green-800"}`}>
              {city.permitRequired ? "Permit Required" : "No Permit Required"}
            </h3>
            <p className={`text-sm ${city.permitRequired ? "text-amber-700" : "text-green-700"}`}>
              {city.permitRequired
                ? `Visiting ${city.name} requires an Inner Line Permit (ILP) for Indian nationals, or a Protected Area Permit (PAP) for foreign nationals. Please obtain this before traveling.`
                : `${city.name} does not require any special travel permit. Standard identification is sufficient.`}
            </p>
          </div>
        </div>

        {city.permitRequired && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* For Indians */}
            <div className="bg-white rounded-2xl border border-nature-100 shadow-sm p-6">
              <h3 className="font-serif text-xl font-semibold text-nature-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-earth-500" />Indian Nationals – ILP</h3>
              <ul className="space-y-2 text-sm text-nature-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Valid government ID (Aadhaar, Passport, or Voter ID)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Passport-size photographs (2–4)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Application form (online or in-person at state government offices)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Processing time: 1–3 working days | Fee: ₹120–₹200</li>
              </ul>
              <a href="https://www.ilpindia.com" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-earth-600 hover:text-earth-700 transition-colors">
                Apply for ILP Online <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* For Foreigners */}
            <div className="bg-white rounded-2xl border border-nature-100 shadow-sm p-6">
              <h3 className="font-serif text-xl font-semibold text-nature-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" />Foreign Nationals – PAP</h3>
              <ul className="space-y-2 text-sm text-nature-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Valid passport and India Visa</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />PAP application (minimum 3 travelers required for some areas)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Itinerary and accommodation confirmation</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />Apply through Indian embassy/consulate or MHA India</li>
              </ul>
              <a href="https://www.mha.gov.in" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                MHA India – Official Portal <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {allFaqs.length > 0 && (
          <div className="mt-4">
            <h2 className="font-serif text-2xl font-semibold text-nature-900 mb-6">Frequently Asked Questions</h2>
            <FAQAccordion items={allFaqs} />
          </div>
        )}
      </div>
    </div>
  );
}
