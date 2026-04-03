import { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
import { PlanningForm } from "@/components/ui/PlanningForm";
import { ContactInfoSection } from "@/components/sections/ContactInfoSection";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Enchanting8 | Travel Assistance & Support",
  description: "Get in touch with Enchanting8 for trip planning, vendor support, and general inquiries about traveling to Northeast India.",
};

const faqs = [
  { 
    question: "How can I book a tour package?", 
    answer: "You can browse our 'Tour Packages' section, select your preferred itinerary, and click 'Inquire'. Our experts will then contact you to finalize the dates and logistics." 
  },
  { 
    question: "How can vendors join the platform?", 
    answer: "Local tour operators, homestay owners, and transport providers can click the 'Vendor Registration' button in the navbar to create an account and list their services." 
  },
  { 
    question: "Do I need permits for Northeast travel?", 
    answer: "Yes, certain states like Arunachal Pradesh, Nagaland, and Mizoram require Inner Line Permits (ILP). We provide full assistance in obtaining these once you book a tour with us." 
  },
  { 
    question: "What is the best time to visit Northeast India?", 
    answer: "General best time is from October to April. However, each state has its unique beauty during different seasons, like the monsoons in Meghalaya." 
  }
];

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-nature-900 text-white text-center">
        <div className="page-container">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            We&apos;re here to help you plan your journey into India&apos;s enchanted frontier.
          </p>
        </div>
      </section>

      {/* Info & Form Grid */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Left Column: Info Cards */}
            <ContactInfoSection />

            {/* Right Column: Form */}
            <div className="lg:w-2/3">
              <div className="bg-nature-50 p-10 md:p-16 rounded-[3rem] border border-nature-100">
                <div className="mb-12">
                  <h2 className="font-serif text-3xl font-bold text-nature-900 mb-4">Send a Message</h2>
                  <p className="text-nature-600">Have a specific question? Fill out the form below and we&apos;ll get back to you.</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Planning Section */}
      <section className="py-24 bg-nature-900 text-white">
        <div className="page-container flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <p className="text-earth-400 font-bold uppercase tracking-widest text-xs mb-4">Personalized Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-white">Trip Planning Assistance</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Tell us what kind of experience you&apos;re looking for, and we&apos;ll help you curate the perfect itinerary.
            </p>
            <div className="space-y-4">
              {['Custom Destinations', 'Budget-Optimized Plans', 'Permit Processing'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-earth-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
                  <span className="font-medium text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <PlanningForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="page-container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-nature-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-nature-600">Quick answers to common inquiries about visiting the Northeast.</p>
          </div>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* Vendor Support CTA */}
      <section className="py-20 border-t border-nature-100">
        <div className="page-container text-center">
          <p className="text-earth-600 font-bold mb-4">Are you a service provider?</p>
          <h2 className="font-serif text-2xl font-bold text-nature-900 mb-8">Join the largest network of Enchanting8 vendors</h2>
          <Link 
            href="/vendor-register" 
            className="inline-block border-2 border-nature-900 text-nature-900 font-bold px-10 py-3 rounded-full hover:bg-nature-900 hover:text-white transition-all shadow-sm"
          >
            Become a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}
