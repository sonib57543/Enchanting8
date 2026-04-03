"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getVendorByEmail } from "@/actions/vendorActions";
import { submitOnboarding } from "@/actions/vendorOnboardingActions";
import { Vendor } from "@prisma/client";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/vendor/login");
    if (status === "authenticated" && session?.user?.email) {
      getVendorByEmail(session.user.email).then((res) => {
        if (res.success && res.data) {
          const v = res.data;
          if (v.status !== "PENDING_ONBOARDING") {
            router.replace("/vendor/dashboard");
          } else {
            setVendor(v);
          }
        } else {
          router.replace("/vendor/dashboard");
        }
        setLoading(false);
      });
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Process checkboxes for amenities
    const amenitiesElements = document.querySelectorAll('input[name="amenity_checkbox"]:checked');
    const amenities = Array.from(amenitiesElements).map((el: any) => el.value);
    if (amenities.length > 0) {
      formData.append("amenitiesStr", JSON.stringify(amenities));
    }

    const res = await submitOnboarding(formData);
    if (res.success) {
      router.push("/vendor/dashboard");
    } else {
      setError(res.error || "Failed to submit onboarding details");
      setIsSubmitting(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-nature-50 pt-32 flex justify-center items-center">
        <div className="animate-spin w-10 h-10 border-4 border-earth-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!vendor) return null;

  const cat = vendor.serviceCategory;

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-earth-600 font-bold uppercase tracking-widest text-xs mb-2">Step 2 of 2</p>
          <h1 className="font-serif text-3xl font-bold text-nature-900">Complete Your Profile</h1>
          <p className="text-nature-600 mt-2">Provide your {cat.replace("_", " & ")} specific details below.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-nature-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. FOOD_CAFE */}
            {cat === "FOOD_CAFE" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Facility Type</label>
                  <select name="facilityType" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900">
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Street Food">Street Food</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Pit spot">Pit spot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Photos (Multiple allowed)</label>
                  <input type="file" name="photos" multiple accept="image/*" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Upload Menu (PDF/Image)</label>
                  <input type="file" name="menuFile" accept="image/*,.pdf" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Or Text Menu/Signature Dishes</label>
                  <textarea name="textMenu" rows={3} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Description</label>
                  <textarea name="description" required rows={3} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Directions/Landmark</label>
                    <input type="text" name="directions" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">GPS Coordinates</label>
                    <input type="text" name="gpsCoordinates" placeholder="e.g. 27.5530, 93.9749" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Timings (e.g., 9 AM - 10 PM)</label>
                  <input type="text" name="timings" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Website/Social Link</label>
                  <input type="url" name="website" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
              </>
            )}

            {/* 2. TOUR_OPERATOR */}
            {cat === "TOUR_OPERATOR" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Company Name</label>
                  <input type="text" name="companyName" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Gender</label>
                  <select name="gender" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Featured Package Title</label>
                  <input type="text" name="packageTitle" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Starting Price (₹)</label>
                  <input type="number" name="startingPrice" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">5 Key Highlights (Comma separated)</label>
                  <textarea name="keyHighlights" required rows={3} placeholder="e.g. 5 Nights, Breakfast Included, Transport, Guide..." className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Website</label>
                  <input type="url" name="website" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
              </>
            )}

            {/* 3. TOUR_GUIDE */}
            {cat === "TOUR_GUIDE" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Photos (Multiple allowed, optional)</label>
                  <input type="file" name="photos" multiple accept="image/*" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">IDs/Documents (Multiple allowed)</label>
                  <input type="file" name="documents" multiple accept="image/*,.pdf" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Age</label>
                  <input type="number" name="age" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Gender</label>
                    <select name="gender" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Locally Verified?</label>
                    <select name="verified" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Places/Regions of Expertise</label>
                  <input type="text" name="placesExpertise" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Timings & Available Days</label>
                  <input type="text" name="timings" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Website or Social Media Link</label>
                  <input type="url" name="website" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
              </>
            )}

            {/* 4. HOSPITAL_PHARMACY */}
            {cat === "HOSPITAL_PHARMACY" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Facility Type</label>
                  <select name="facilityType" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3">
                    <option value="Hospital">Hospital</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Diagnostic">Diagnostic Center</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Direction/Landmark</label>
                    <input type="text" name="directions" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Timings (or 24/7)</label>
                    <input type="text" name="timings" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Photos (Optional)</label>
                  <input type="file" name="photos" multiple accept="image/*" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Fees / Consultation starting at</label>
                  <input type="text" name="fees" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Emergency", "ICU", "Ambulance", "Lab Testing", "Online Delivery", "Wheelchair Access"].map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-nature-700">
                        <input type="checkbox" name="amenity_checkbox" value={item} className="w-4 h-4 text-earth-600 rounded" /> {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Website</label>
                  <input type="url" name="website" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
              </>
            )}

            {/* 5. HOTEL_HOMESTAY */}
            {cat === "HOTEL_HOMESTAY" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Property Type</label>
                  <select name="propertyType" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3">
                    <option value="Hotel">Hotel</option>
                    <option value="Homestay">Homestay</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Direction/Landmark</label>
                    <input type="text" name="directions" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-nature-900 mb-2">Starting Price (₹/night)</label>
                    <input type="number" name="startingPrice" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Check-in / Check-out Timings</label>
                  <input type="text" name="timings" required className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Photos (Multiple allowed)</label>
                  <input type="file" name="photos" multiple accept="image/*" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Free WiFi", "Parking", "Restaurant", "Pool", "AC", "Laundry"].map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-nature-700">
                        <input type="checkbox" name="amenity_checkbox" value={item} className="w-4 h-4 text-earth-600 rounded" /> {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-nature-900 mb-2">Booking Website/Link</label>
                  <input type="url" name="website" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3" />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-earth-500 hover:bg-earth-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? "Submitting Application..." : "Complete Setup & Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
