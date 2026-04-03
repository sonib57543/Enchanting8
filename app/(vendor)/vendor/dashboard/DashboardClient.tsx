"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getVendorByEmail, submitVendorEdits } from "@/actions/vendorActions";
import { Vendor } from "@prisma/client";
import { LogOut, Save, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardClient({ initialVendor }: { initialVendor: Vendor }) {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor>(initialVendor);

  function parseDetails(str: string | null): Record<string, string> {
    if (!str) return {};
    try { return JSON.parse(str); } catch { return {}; }
  }
  
  const [draftDetails, setDraftDetails] = useState<Record<string, string>>(
    initialVendor.vendorDetails ? parseDetails(initialVendor.vendorDetails) : {}
  );
  
  const [coreDetails, setCoreDetails] = useState<Record<string, string>>({
    businessName: initialVendor.businessName,
    ownerName: initialVendor.ownerName,
    email: initialVendor.email,
    phone: initialVendor.phone,
    city: initialVendor.city,
    state: initialVendor.state,
    address: initialVendor.address
  });

  const [isEditing, setIsEditing] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setCoreDetails({
      businessName: vendor.businessName,
      ownerName: vendor.ownerName,
      email: vendor.email,
      phone: vendor.phone,
      city: vendor.city,
      state: vendor.state,
      address: vendor.address
    });
    setDraftDetails(vendor.vendorDetails ? parseDetails(vendor.vendorDetails) : {});
  };

  const handleSaveEdits = async () => {
    setIsSaving(true);
    setSubmitMsg(null);
    try {
      const res = await submitVendorEdits(vendor.id, draftDetails, coreDetails);
      if (!res.success) {
        setSubmitMsg({ type: "error", text: res.message || "Failed to update profile." });
        return;
      }
      
      setSubmitMsg({ type: "success", text: "Profile updated. Waiting for admin approval." });
      setIsEditing(false);
      
      const vendorRes = await getVendorByEmail(vendor.email);
      if (vendorRes.success && vendorRes.data) {
        setVendor(vendorRes.data);
      }
      
      router.refresh();
    } catch (err) {
      setSubmitMsg({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const currentDetails = parseDetails(vendor.vendorDetails);

  const statusColors: Record<string, string> = {
    PENDING_ONBOARDING: "bg-gray-100 text-gray-700",
    PENDING_APPROVAL: "bg-amber-100 text-amber-700",
    NEEDS_REVIEW: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-nature-900">{vendor.businessName}</h1>
            <p className="text-nature-500 text-sm mt-1">Vendor Portal · {vendor.city}, {vendor.state}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/vendor/login" })} className="flex items-center gap-2 text-sm text-nature-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Status Banner */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-nature-400 uppercase tracking-widest font-medium mb-1">Account Status</p>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusColors[vendor.status] || "bg-gray-100 text-gray-600"}`}>
              {vendor.status.replace("_", " ")}
            </span>
          </div>
          {vendor.status === "PENDING_APPROVAL" && (
            <p className="text-sm text-nature-500 text-right max-w-sm">Your application is under admin review. You will be able to appear on the public listings once approved.</p>
          )}
          {vendor.status === "NEEDS_REVIEW" && (
            <p className="text-sm text-orange-600 text-right max-w-sm">Admin requested changes or your profile is under re-evaluation. Please update your profile below.</p>
          )}
          {vendor.status === "APPROVED" && (
            <p className="text-sm text-green-700 text-right max-w-sm">Your business is listed and visible to travelers on the platform. ✓</p>
          )}
          {vendor.status === "REJECTED" && (
            <p className="text-sm text-red-600 text-right max-w-sm">Your application was not approved. Please contact support for details.</p>
          )}
        </div>

        {/* Pending Edits Notice */}
        {vendor.hasPendingEdits && (
          <div className="bg-purple-50 border border-purple-200 text-purple-800 p-5 rounded-2xl flex items-center gap-4">
            <Clock className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Profile edits pending admin approval</p>
              <p className="text-sm opacity-80 mt-0.5">Your recent changes are under review. You&apos;ll be notified once they&apos;re approved.</p>
            </div>
          </div>
        )}

        {/* Submit success message */}
        {submitMsg && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${submitMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {submitMsg.text}
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-nature-900">Business Profile</h2>
            {(vendor.status === "APPROVED" || vendor.status === "NEEDS_REVIEW") && !vendor.hasPendingEdits && (
              <div className="flex items-center gap-3">
                {vendor.serviceCategory === "TOUR_OPERATOR" && (
                  <button
                    onClick={() => router.push("/vendor/dashboard/packages")}
                    className="text-sm text-nature-700 font-bold border border-nature-200 px-4 py-2 rounded-xl hover:bg-nature-50 transition-all"
                  >
                    Manage Packages
                  </button>
                )}
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="text-sm text-nature-600 font-bold border border-nature-200 px-4 py-2 rounded-xl hover:bg-nature-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdits}
                      disabled={isSaving}
                      className="flex items-center gap-2 text-sm text-white bg-earth-500 font-bold px-4 py-2 rounded-xl hover:bg-earth-600 transition-all disabled:opacity-70"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setIsEditing(true); setSubmitMsg(null); }}
                    className="text-sm text-earth-600 font-bold border border-earth-200 px-4 py-2 rounded-xl hover:bg-earth-50 transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-nature-700">
            <div>
              <span className="font-semibold text-nature-900 block mb-1">Business Name</span>
              {isEditing ? <input disabled={!isEditing} value={coreDetails.businessName || ""} onChange={e => setCoreDetails({...coreDetails, businessName: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.businessName}
            </div>
            <div>
              <span className="font-semibold text-nature-900 block mb-1">Owner</span>
              {isEditing ? <input disabled={!isEditing} value={coreDetails.ownerName || ""} onChange={e => setCoreDetails({...coreDetails, ownerName: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.ownerName}
            </div>
            <div>
              <span className="font-semibold text-nature-900 block mb-1">Email</span>
              {isEditing ? <input type="email" disabled={!isEditing} value={coreDetails.email || ""} onChange={e => setCoreDetails({...coreDetails, email: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.email}
            </div>
            <div>
              <span className="font-semibold text-nature-900 block mb-1">Phone</span>
              {isEditing ? <input type="tel" disabled={!isEditing} value={coreDetails.phone || ""} onChange={e => setCoreDetails({...coreDetails, phone: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.phone}
            </div>
            <div><span className="font-semibold text-nature-900 block mb-1">Type</span>{vendor.serviceCategory.replace("_", " ")}</div>
            <div>
              <span className="font-semibold text-nature-900 block mb-1">City</span>
              {isEditing ? <input disabled={!isEditing} value={coreDetails.city || ""} onChange={e => setCoreDetails({...coreDetails, city: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.city}
            </div>
            <div>
              <span className="font-semibold text-nature-900 block mb-1">State</span>
              {isEditing ? <input disabled={!isEditing} value={coreDetails.state || ""} onChange={e => setCoreDetails({...coreDetails, state: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.state}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-nature-900 block mb-1">Address</span>
              {isEditing ? <textarea disabled={!isEditing} rows={2} value={coreDetails.address || ""} onChange={e => setCoreDetails({...coreDetails, address: e.target.value})} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" /> : vendor.address}
            </div>
          </div>

          {/* Type-specific details */}
          {Object.keys(currentDetails).length > 0 && (
            <>
              <hr className="border-nature-100" />
              <div>
                <h3 className="font-semibold text-nature-900 mb-4 text-base">Service Details</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    {Object.keys(currentDetails).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-bold text-nature-800 mb-1 capitalize">{key}</label>
                        <input
                          disabled={!isEditing}
                          value={draftDetails[key] ?? currentDetails[key]}
                          onChange={(e) => setDraftDetails(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-nature-700">
                    {Object.entries(currentDetails).map(([k, v]) => (
                      <div key={k}><span className="font-semibold text-nature-900 block capitalize">{k}</span>{v}</div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
