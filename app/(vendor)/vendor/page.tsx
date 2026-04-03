"use client";

import { useSession, signOut } from "next-auth/react";
import { Clock, CheckCircle2, AlertCircle, Building, MapPin, Mail, Phone, ArrowUpRight, ShieldX, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getVendorByEmail } from "@/actions/vendorActions";

export default function VendorDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      getVendorByEmail(user.email).then(setVendorData);
    }
  }, [user?.email]);

  const isApproved = vendorData?.status === "APPROVED";
  const isRejected = vendorData?.verificationStatus === "REJECTED" || vendorData?.status === "REJECTED";

  return (
    <div className="bg-nature-50 min-h-screen pb-20">
      <div className="page-container py-12 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-earth-600 font-bold text-sm uppercase tracking-widest mb-2">
              <Building className="w-4 h-4" /> Vendor Dashboard
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-nature-900">
              Welcome, {user?.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isApproved && (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold shadow-sm bg-green-50 text-green-700 border-green-200">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Verified Vendor
              </div>
            )}
            {!isApproved && !isRejected && (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold shadow-sm bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="w-4 h-4" />
                Pending Verification
              </div>
            )}
            {isRejected && (
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold shadow-sm bg-red-50 text-red-700 border-red-200">
                <ShieldX className="w-4 h-4" />
                Verification Rejected
              </div>
            )}

            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 rounded-xl bg-white border border-nature-200 text-nature-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-bold shadow-sm flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>

        {!isApproved ? (
          /* Pending & Rejected Content */
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-nature-100 shadow-xl text-center max-w-3xl mx-auto space-y-6">
            
            {isRejected ? (
              // Rejection State
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <ShieldX className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-serif text-nature-900">Application Not Approved</h2>
                  <p className="text-nature-600">
                    Unfortunately, your application or Government ID could not be verified by our team.
                  </p>
                </div>
                {vendorData?.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700 text-left">
                    <h4 className="font-bold flex items-center gap-2 uppercase tracking-wide text-xs mb-2 text-red-800">Reason Provided by Admin</h4>
                    <p className="font-medium text-base">{vendorData.rejectionReason}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-nature-100">
                  <p className="text-nature-500 text-sm mb-4">Please contact support or re-register with valid credentials.</p>
                  <Link href="/contact" className="inline-block bg-nature-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            ) : (
              // Pending State
              <>
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-serif text-nature-900">Verification in Progress</h2>
                  <p className="text-nature-600">
                    Thank you for submitting your Government ID. Our team is currently reviewing your business details and credentials.
                  </p>
                </div>
                <div className="bg-nature-50 rounded-2xl p-6 text-sm text-nature-700 text-left border border-nature-100">
                  <h4 className="font-bold mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-earth-500" /> What to expect:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><span>•</span> <span>Our team will manually verify your <strong>{vendorData?.governmentIdType?.replace("_", " ") || "Government ID"}</strong>.</span></li>
                    <li className="flex gap-2"><span>•</span> <span>We may call you at <strong>{user?.email}</strong> for a brief interview if clarification is needed.</span></li>
                    <li className="flex gap-2"><span>•</span> <span>Once approved, you&apos;ll be awarded the Verified Vendor badge and can create listings.</span></li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Approved Dashboard Content (Placeholder for future) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-3xl p-8 border border-nature-100 shadow-sm">
                <h3 className="font-serif text-xl font-bold mb-6">Service Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-nature-50 rounded-2xl border border-nature-100">
                    <p className="text-xs text-nature-500 font-bold uppercase mb-1">Active Listings</p>
                    <p className="text-2xl font-bold text-nature-900">0</p>
                  </div>
                  <div className="p-4 bg-nature-50 rounded-2xl border border-nature-100">
                    <p className="text-xs text-nature-500 font-bold uppercase mb-1">Total Enquiries</p>
                    <p className="text-2xl font-bold text-nature-900">0</p>
                  </div>
                </div>
              </section>

              <div className="bg-nature-900 rounded-3xl p-8 text-white">
                <h3 className="font-serif text-xl font-bold mb-4">Need to list a new service?</h3>
                <p className="text-nature-400 text-sm mb-6">Start by adding your property, guide details or tour packages to our listing database.</p>
                <button className="bg-earth-500 hover:bg-earth-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-2">
                  Add New Listing <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
               <section className="bg-white rounded-3xl p-6 border border-nature-100 shadow-sm">
                 <h3 className="font-bold text-nature-900 mb-4">Public Profile</h3>
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-earth-100 text-earth-600 flex items-center justify-center font-bold">{user?.name[0]}</div>
                     <div>
                       <p className="font-bold text-nature-900">{user?.name}</p>
                       <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5"><ShieldCheck className="w-3 h-3" /> Verified Partner</p>
                     </div>
                   </div>
                   <div className="space-y-2 text-sm text-nature-600">
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 XXX-XXX-XXXX</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Guwahati, Assam</p>
                   </div>
                   <button className="w-full py-2 border border-nature-200 rounded-lg text-sm font-bold text-nature-700 hover:bg-nature-50 transition-colors">Edit Profile</button>
                 </div>
               </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
