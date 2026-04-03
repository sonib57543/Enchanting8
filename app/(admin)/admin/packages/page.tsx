"use client";

import { useEffect, useState } from "react";
import { getPendingPackages, updatePackageStatus } from "@/actions/packageActions";
import { Check, X } from "lucide-react";

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getPendingPackages();
      if (res.success) {
        setPackages(res.data || []);
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await updatePackageStatus(id, newStatus);
      if (!res.success) {
        alert(res.message || "Failed to update package.");
        fetchPackages();
      }
    } catch (e) {
      alert("An unexpected error occurred.");
      fetchPackages();
    }
  };

  if (loading) return <div className="p-8">Loading package submissions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Packages Approval Inbox</h1>
        <p className="text-sm text-gray-500 mt-1">Review itinerary packages submitted by Tour Operators.</p>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
          No pending packages require your attention.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-gray-900">{pkg.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    pkg.status === "PENDING_APPROVAL" ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {pkg.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">{pkg.description}</p>
                <div className="flex items-center gap-6 mt-3 text-sm text-gray-700 font-medium">
                  <div>Vendor: <span className="font-bold">{pkg.vendor?.businessName}</span></div>
                  <div>City: <span className="font-bold">{pkg.city}</span></div>
                  <div>Price: <span className="font-bold">₹{pkg.price}</span></div>
                  <div>Duration: <span className="font-bold">{pkg.durationDays} Days</span></div>
                </div>
                <details className="mt-4 cursor-pointer text-sm font-semibold text-earth-600">
                  <summary>View Itinerary & Details</summary>
                  <div className="pt-3 pb-1 pl-4 border-l-2 border-earth-200 mt-2 space-y-3 font-normal text-gray-700">
                    <p><strong>Highlights:</strong> {JSON.parse(pkg.highlights || "[]").join(", ")}</p>
                    <p><strong>Includes:</strong> {JSON.parse(pkg.includes || "[]").join(", ")}</p>
                    {pkg.itinerary?.map((day: any) => (
                      <div key={day.id} className="pt-2">
                        <div className="font-bold flex gap-2"><span>Day {day.day}:</span> {day.title}</div>
                        <p className="text-gray-600 text-xs mt-1">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              <div className="flex md:flex-col gap-3 shrink-0 items-start">
                <button
                  onClick={() => handleStatusUpdate(pkg.id, "APPROVED")}
                  className="bg-green-100 hover:bg-green-200 text-green-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(pkg.id, "REJECTED")}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors w-full justify-center"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
