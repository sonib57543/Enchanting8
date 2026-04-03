"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPackagesByVendor, deletePackage } from "@/actions/packageActions";
import { LogOut, Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function VendorPackages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/vendor/login");
    }
    if (status === "authenticated" && session?.user) {
      const vendorId = (session.user as any).id;
      if (vendorId) {
        getPackagesByVendor(vendorId).then((res) => {
          if (res.success) {
            setPackages(res.data || []);
          } else {
            console.error(res.message);
          }
          setLoading(false);
        });
      }
    }
  }, [status, session, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const vendorId = (session?.user as any).id;
    await deletePackage(id, vendorId);
    setPackages(packages.filter((p) => p.id !== id));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-nature-50 pt-32 flex justify-center items-center">
        <div className="animate-spin w-10 h-10 border-4 border-earth-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING_APPROVAL: "bg-amber-100 text-amber-700",
    NEEDS_REVIEW: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-nature-900">My Packages</h1>
            <p className="text-nature-500 text-sm mt-1">Manage your tour itineraries and offerings.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/vendor/dashboard" className="text-sm font-bold text-nature-600 hover:text-earth-600 transition-colors">
              Back to Profile
            </Link>
            <Link href="/vendor/dashboard/packages/new" className="flex items-center gap-2 bg-earth-500 hover:bg-earth-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md">
              <Plus className="w-4 h-4" /> Create Package
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-nature-100 overflow-hidden">
          {packages.length === 0 ? (
            <div className="p-12 text-center text-nature-500">
              <p>You haven&apos;t created any packages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-nature-100">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-nature-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-serif text-xl font-bold text-nature-900">{pkg.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${statusColors[pkg.status] || "bg-gray-100"}`}>
                        {pkg.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-nature-600 max-w-2xl line-clamp-1">{pkg.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm font-semibold text-nature-700">
                      <span>₹{pkg.price}</span>
                      <span className="w-1 h-1 rounded-full bg-nature-300" />
                      <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                      <span className="w-1 h-1 rounded-full bg-nature-300" />
                      <span>{pkg.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/vendor/dashboard/packages/${pkg.id}`}
                      className="p-2.5 text-earth-600 hover:bg-earth-50 rounded-xl transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
