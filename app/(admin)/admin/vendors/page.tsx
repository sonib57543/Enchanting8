"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@prisma/client";
import {
  getVendors,
  updateVendorStatus,
  approveVendorEdits,
  rejectVendorEdits,
  deactivateVendor,
  activateVendor,
  permanentDeleteVendor
} from "@/actions/vendorActions";
import { CheckCircle2, XCircle, Eye, GitMerge, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "new" | "edits" | "all";

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [tab, setTab] = useState<Tab>("new");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      "FOOD_CAFE": "Food & Café / Restaurant",
      "TOUR_OPERATOR": "Tour Operator / Travel Agent",
      "TOUR_GUIDE": "Local Tour Guide",
      "HOSPITAL_PHARMACY": "Hospital / Pharmacy & Others",
      "HOTEL_HOMESTAY": "Hotel / Homestay / Lodge"
    };
    return map[cat] || cat;
  };

  useEffect(() => {
    getVendors().then((res) => {
      if (res.success) {
        setVendors(res.data || []);
      } else {
        toast.error(res.message || "Failed to load vendors.");
      }
      setLoading(false);
    });
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const pendingStatuses = ["PENDING", "PENDING_ONBOARDING", "PENDING_APPROVAL", "NEEDS_REVIEW"];
  const newApplications = vendors.filter((v) => pendingStatuses.includes(v.status));
  const pendingEdits = vendors.filter((v) => v.hasPendingEdits);

  const baseDisplayed = tab === "new" ? newApplications : tab === "edits" ? pendingEdits : vendors;

  const displayed = baseDisplayed.filter(v => {
    const matchSearch = v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = filterCity === "ALL" || v.city === filterCity;
    const matchCat = filterCategory === "ALL" || v.serviceCategory === filterCategory;
    const matchStatus = filterStatus === "ALL" || v.status === filterStatus;
    return matchSearch && matchCity && matchCat && matchStatus;
  });

  // Extract unique filter options
  const uniqueCities = Array.from(new Set(vendors.map(v => v.city).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(vendors.map(v => v.serviceCategory).filter(Boolean)));

  const handleStatus = async (id: string, status: string) => {
    let reason = undefined;
    if (status === "REJECTED") {
      const input = window.prompt("Please provide a reason for rejecting this application:");
      if (input === null) return; // Cancelled
      reason = input || "No specific reason provided.";
    }
    
    try {
      const res = await updateVendorStatus(id, status, reason);
      if (res.success) {
        const updated = res.data;
        setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        toast.success(`Vendor marked as ${status.replace("_", " ")}`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleApproveEdits = async (id: string) => {
    const res = await approveVendorEdits(id);
    if (res.success) {
      const updated = res.data;
      setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.success("Profile edits approved and published");
    } else {
      toast.error(res.message || "Failed to approve edits");
    }
  };

  const handleRejectEdits = async (id: string) => {
    const res = await rejectVendorEdits(id);
    if (res.success) {
      const updated = res.data;
      setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.success("Profile edits rejected");
    } else {
      toast.error(res.message || "Failed to reject edits");
    }
  };

  const handleRequestChanges = async (id: string) => {
    const res = await updateVendorStatus(id, "NEEDS_REVIEW");
    if (res.success) {
      const updated = res.data;
      setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.info("Vendor status set to NEEDS_REVIEW");
    } else {
      toast.error(res.message || "Failed to request changes");
    }
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    if (currentlyActive) {
      if (!confirm("Are you sure you want to suspend this vendor? Their packages will be hidden.")) return;
      const res = await deactivateVendor(id);
      if (res.success) {
        const updated = res.data;
        setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        toast.warning("Vendor account suspended");
      } else {
        toast.error(res.message || "Failed to deactivate vendor");
      }
    } else {
      const res = await activateVendor(id);
      if (res.success) {
        const updated = res.data;
        setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        toast.success("Vendor account restored");
      } else {
        toast.error(res.message || "Failed to activate vendor");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("CRITICAL WARNING: This will permanently delete the vendor and ALL their packages. Proceed?")) return;
    const res = await permanentDeleteVendor(id);
    if (res.success) {
      setVendors((prev) => prev.filter(v => v.id !== id));
      toast.error("Vendor permanently deleted");
    } else {
      toast.error(res.message || "Failed to delete vendor");
    }
  };

  const parseJson = (str: string | null) => {
    if (!str) return {};
    try { return JSON.parse(str); } catch { return {}; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-nature-900">Vendor Applications</h1>
        <p className="text-nature-500 text-sm mt-0.5">Review new applications and approve vendor profile edits.</p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", count: vendors.length, color: "bg-nature-50 border-nature-200 text-nature-700", dot: "bg-nature-400" },
          { label: "Approved (Total)", count: vendors.filter((v: any) => v.status === "APPROVED").length, color: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-400" },
          { label: "Active Live", count: vendors.filter((v: any) => v.status === "APPROVED" && v.isActive).length, color: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-400" },
          { label: "Suspended / Inactive", count: vendors.filter((v: any) => !v.isActive).length, color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-400" },
        ].map(({ label, count, color, dot }) => (
          <div key={label} className={`rounded-xl border p-4 flex items-center gap-3 ${color}`}>
            <div className={`w-2.5 h-2.5 flex-shrink-0 rounded-full ${dot}`} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-0.5">{label}</p>
              <p className="text-2xl font-black">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
        <div className="flex gap-2">
          {([["new", "New Applications"], ["edits", "Pending Edits"], ["all", "All Vendors"]] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setFilterStatus("ALL"); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2",
                tab === key
                  ? "border-earth-500 text-earth-700"
                  : "border-transparent text-nature-500 hover:text-nature-700"
              )}
            >
              {label}
              {key === "new" && newApplications.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 font-black px-2 py-0.5 rounded-full">{newApplications.length}</span>
              )}
              {key === "edits" && pendingEdits.length > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 font-black px-2 py-0.5 rounded-full">{pendingEdits.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-nature-500 uppercase flex items-center gap-1.5 mb-1"><Search className="w-3.5 h-3.5"/> Search Name or Email</label>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type to search..." className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400" />
        </div>
        <div className="w-full md:w-48">
          <label className="text-xs font-bold text-nature-500 uppercase mb-1 block">Filter By City</label>
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400">
            <option value="ALL">All Cities</option>
            {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48">
          <label className="text-xs font-bold text-nature-500 uppercase mb-1 block">Filter By Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400">
            <option value="ALL">All Categories</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
          </select>
        </div>
        {tab === "all" && (
          <div className="w-full md:w-48">
            <label className="text-xs font-bold text-nature-500 uppercase flex items-center gap-1.5 mb-1"><Filter className="w-3.5 h-3.5"/> Filter Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-earth-400">
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              {pendingStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-nature-400">Loading...</div>
        ) : displayed.length === 0 ? (
          <div className="p-12 text-center text-nature-400">
            {tab === "new" ? "No pending applications at this time." : "No pending profile edits."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Business", "Type", "Location", "Status", "Submitted", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-nature-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((v) => (
                  <>
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-nature-900">{v.businessName}</p>
                        <p className="text-xs text-nature-400">{v.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-nature-100 text-nature-700 px-2 py-0.5 rounded-full">{getCategoryLabel(v.serviceCategory)}</span>
                      </td>
                      <td className="px-6 py-4 text-nature-500 text-xs">{v.city}, {v.state}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-semibold",
                          v.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          v.status === "REJECTED" ? "bg-red-100 text-red-700" :
                          v.status === "NEEDS_REVIEW" ? "bg-orange-100 text-orange-700" :
                          "bg-amber-100 text-amber-700" // default pending
                        )}>{v.status.replace("_", " ")}</span>
                        {v.hasPendingEdits && <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Edits pending</span>}
                        {v.status === "APPROVED" && (
                          <span className="block mt-1 text-[10px] text-green-600 font-bold bg-green-50 inline-block px-1.5 rounded border border-green-100">
                            ✓ Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-nature-400 text-xs">{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {tab === "new" ? (
                            <>
                              <button title="Approve" onClick={() => handleStatus(v.id, "APPROVED")} className="text-green-500 hover:text-green-700"><CheckCircle2 className="w-4.5 h-4.5" /></button>
                              <button title="Request Changes" onClick={() => handleRequestChanges(v.id)} className="text-orange-400 hover:text-orange-600"><GitMerge className="w-4.5 h-4.5" /></button>
                              <button title="Reject" onClick={() => handleStatus(v.id, "REJECTED")} className="text-red-400 hover:text-red-600"><XCircle className="w-4.5 h-4.5" /></button>
                            </>
                          ) : tab === "edits" ? (
                            <>
                              <button title="Approve Edits" onClick={() => handleApproveEdits(v.id)} className="text-green-500 hover:text-green-700"><GitMerge className="w-4.5 h-4.5" /></button>
                              <button title="Reject Edits" onClick={() => handleRejectEdits(v.id)} className="text-red-400 hover:text-red-600"><XCircle className="w-4.5 h-4.5" /></button>
                            </>
                          ) : (
                            <>
                              <button title={v.isActive ? "Suspend Vendor" : "Restore Vendor"} onClick={() => handleToggleActive(v.id, v.isActive)} className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${v.isActive ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100' : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'}`}>
                                {v.isActive ? "Suspend" : "Restore"}
                              </button>
                              <button title="Permanent Delete" onClick={() => handleDelete(v.id)} className="text-[10px] uppercase font-bold text-red-600 px-2 py-1 bg-red-50 border border-red-200 rounded-md hover:bg-red-100">Delete</button>
                            </>
                          )}
                          <button title="Toggle Details" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)} className="text-nature-400 hover:text-earth-600 ml-2">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === v.id && (
                      <tr key={`${v.id}-detail`} className="bg-nature-50">
                        <td colSpan={6} className="px-6 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-nature-700">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 justify-between">
                                <h4 className="font-bold text-nature-900 text-base">Registration Details</h4>
                                {!v.isActive && <span className="text-[10px] bg-red-100 text-red-800 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Suspended Account</span>}
                              </div>
                              <p><span className="font-semibold">Owner:</span> {v.ownerName}</p>
                              <p><span className="font-semibold">Phone:</span> {v.phone}</p>
                              <p><span className="font-semibold">Address:</span> {v.address}</p>
                              {(v as any).description && <p><span className="font-semibold">Description:</span> {(v as any).description}</p>}
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-bold text-nature-900 text-base">Service Details</h4>
                                {Object.entries(parseJson(v.vendorDetails)).map(([k, val]) => (
                                  <p key={k}><span className="font-semibold capitalize">{k}:</span> {String(val)}</p>
                                ))}
                              </div>

                              <div className="space-y-2 pt-4 border-t border-nature-100">
                                <h4 className="font-bold text-nature-900 text-base">Government Verification</h4>
                                
                                <div className="bg-nature-50 p-6 rounded-xl border border-nature-200 flex flex-col gap-6">
                                  {v.serviceCategory === "HOTEL_HOMESTAY" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-nature-500 uppercase flex items-center gap-1">Owner Aadhaar</p>
                                        {(v as any).aadhaarUrl ? (
                                          <a href={(v as any).aadhaarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-earth-100 text-earth-700 hover:bg-earth-200 px-3 py-2 rounded-lg font-bold text-xs transition-colors">
                                            <Eye className="w-3.5 h-3.5" /> View Aadhaar
                                          </a>
                                        ) : <p className="text-red-400 text-xs font-bold">Missing</p>}
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-nature-500 uppercase flex items-center gap-1">GST Certificate</p>
                                        {(v as any).gstUrl ? (
                                          <a href={(v as any).gstUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-earth-100 text-earth-700 hover:bg-earth-200 px-3 py-2 rounded-lg font-bold text-xs transition-colors">
                                            <Eye className="w-3.5 h-3.5" /> View GST
                                          </a>
                                        ) : <p className="text-red-400 text-xs font-bold">Missing</p>}
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-nature-500 uppercase flex items-center gap-1">PAN Card</p>
                                        {(v as any).panUrl ? (
                                          <a href={(v as any).panUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-earth-100 text-earth-700 hover:bg-earth-200 px-3 py-2 rounded-lg font-bold text-xs transition-colors">
                                            <Eye className="w-3.5 h-3.5" /> View PAN
                                          </a>
                                        ) : <p className="text-red-400 text-xs font-bold">Missing</p>}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-start gap-4">
                                      <div>
                                        <p className="text-[10px] font-bold text-nature-500 uppercase mb-1">Document Type</p>
                                        <p className="font-bold text-nature-900">{(v as any).governmentIdType?.replace("_", " ") || "Not Provided"}</p>
                                      </div>
                                      
                                      {(v as any).governmentIdUrl ? (
                                        <a 
                                          href={(v as any).governmentIdUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 hover:bg-earth-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                        >
                                          <Eye className="w-4 h-4" /> View Document
                                        </a>
                                      ) : (
                                        <p className="text-red-500 font-bold text-sm">Action Required: No document found.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {v.hasPendingEdits && v.draftData && (
                                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                  <h5 className="font-bold text-purple-800 mb-2">Proposed Edits</h5>
                                  {Object.entries(parseJson(v.draftData)).map(([k, val]) => (
                                    <p key={k} className="text-purple-700"><span className="font-semibold capitalize">{k}:</span> {String(val)}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
