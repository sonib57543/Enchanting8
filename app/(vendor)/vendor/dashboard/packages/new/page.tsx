"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createPackage } from "@/actions/packageActions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function NewPackage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [itinerary, setItinerary] = useState([{ day: 1, title: "", description: "" }]);
  const [includes, setIncludes] = useState([""]);
  const [excludes, setExcludes] = useState([""]);
  const [highlights, setHighlights] = useState(["", "", "", "", ""]); // Exactly 5

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const vendorId = (session?.user as any).id;

      const payload = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        city: formData.get("city") as string,
        price: formData.get("price") as string,
        durationDays: formData.get("durationDays") as string,
        durationNights: formData.get("durationNights") as string,
        destinations: (formData.get("destinations") as string).split(",").map(d => d.trim()),
        images: (formData.get("images") as string).split(",").map(img => img.trim()),
        includes: includes.filter(i => i.trim()),
        excludes: excludes.filter(e => e.trim()),
        highlights: highlights.filter(h => h.trim()),
        slug: (formData.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      };

      const res = await createPackage(vendorId, payload as any, itinerary);
      if (res.success) {
        router.push("/vendor/dashboard/packages");
      } else {
        setError(res.message || "Failed to create package.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-nature-900">Create New Package</h1>
            <p className="text-nature-500 text-sm mt-1">Design a new travel experience for approvals.</p>
          </div>
          <Link href="/vendor/dashboard/packages" className="flex items-center gap-2 text-sm font-bold text-nature-600 hover:text-earth-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-nature-100 space-y-6">
            <h2 className="font-serif text-xl font-bold text-nature-900 border-b pb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-nature-900 mb-2">Package Title</label>
                <input type="text" name="title" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-nature-900 mb-2">Description</label>
                <textarea name="description" required rows={4} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Primary City</label>
                <input type="text" name="city" required placeholder="e.g. Ziro" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Price (₹)</label>
                <input type="number" name="price" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Duration (Days)</label>
                <input type="number" name="durationDays" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Duration (Nights)</label>
                <input type="number" name="durationNights" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-nature-900 mb-2">All Covered Destinations (comma separated)</label>
                <input type="text" name="destinations" required placeholder="Ziro, Itanagar, Tawang" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-nature-900 mb-2">Image URLs (comma separated)</label>
                <input type="text" name="images" required placeholder="https://..., https://..." className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-nature-100 space-y-6">
            <h2 className="font-serif text-xl font-bold text-nature-900 border-b pb-4">Key Details</h2>
            
            <div>
              <label className="block text-sm font-bold text-nature-900 mb-4">5 Key Highlights</label>
              <div className="space-y-3">
                {highlights.map((h, i) => (
                  <input key={i} value={h} onChange={(e) => {
                    const newH = [...highlights]; newH[i] = e.target.value; setHighlights(newH);
                  }} placeholder={`Highlight ${i+1}`} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" required />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-nature-900">Includes</label>
                  <button type="button" onClick={() => setIncludes([...includes, ""])} className="text-earth-600 text-sm font-bold hover:underline">Add</button>
                </div>
                {includes.map((inc, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={inc} onChange={(e) => {
                      const newI = [...includes]; newI[i] = e.target.value; setIncludes(newI);
                    }} className="flex-1 bg-nature-50 border border-nature-200 rounded-xl px-4 py-2" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-nature-900">Excludes</label>
                  <button type="button" onClick={() => setExcludes([...excludes, ""])} className="text-earth-600 text-sm font-bold hover:underline">Add</button>
                </div>
                {excludes.map((exc, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={exc} onChange={(e) => {
                      const newE = [...excludes]; newE[i] = e.target.value; setExcludes(newE);
                    }} className="flex-1 bg-nature-50 border border-nature-200 rounded-xl px-4 py-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-nature-100 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-serif text-xl font-bold text-nature-900">Daily Itinerary</h2>
              <button type="button" onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "" }])} className="flex items-center gap-1 text-earth-600 text-sm font-bold hover:underline">
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>
            
            <div className="space-y-6">
              {itinerary.map((item, i) => (
                <div key={i} className="bg-nature-50 p-6 rounded-2xl relative">
                  <button type="button" onClick={() => setItinerary(itinerary.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-nature-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-earth-500 text-white flex items-center justify-center font-bold">D{item.day}</div>
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const newIt = [...itinerary]; newIt[i].title = e.target.value; setItinerary(newIt);
                      }}
                      placeholder="Day Title"
                      required
                      className="flex-1 bg-white border border-nature-200 rounded-xl px-4 py-2 font-bold text-nature-900"
                    />
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newIt = [...itinerary]; newIt[i].description = e.target.value; setItinerary(newIt);
                    }}
                    placeholder="Day Description"
                    required
                    rows={3}
                    className="w-full bg-white border border-nature-200 rounded-xl px-4 py-3"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-earth-500 hover:bg-earth-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70">
            {loading ? "Saving Package..." : "Submit Package for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
