"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NORTHEAST_CITIES } from "@/lib/locations";
import { registerVendor } from "@/actions/vendorAuthActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  serviceCategory: z.enum(["FOOD_CAFE", "TOUR_OPERATOR", "TOUR_GUIDE", "HOSPITAL_PHARMACY", "HOTEL_HOMESTAY"]),
  governmentIdType: z.string().min(1, "Please select an ID type"),
  governmentIdUrl: z.string().optional(),
  aadhaarUrl: z.string().optional(),
  gstUrl: z.string().optional(),
  panUrl: z.string().optional(),
  city: z.string().min(1, "Please select a city"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(5, "Full address is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VendorFormValues = z.infer<typeof vendorSchema>;

export default function VendorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      serviceCategory: "HOTEL_HOMESTAY",
      governmentIdType: "",
    }
  });

  const selectedCategory = watch("serviceCategory");

  // Single file for standard vendors
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Multiple files for hotels
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);

  const [fileError, setFileError] = useState("");

  const validateFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      return "Only JPG, PNG, and PDF files are allowed";
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'standard' | 'aadhaar' | 'gst' | 'pan') => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      
      if (error) {
        setFileError(error);
        if (type === 'standard') setSelectedFile(null);
        if (type === 'aadhaar') setAadhaarFile(null);
        if (type === 'gst') setGstFile(null);
        if (type === 'pan') setPanFile(null);
        return;
      }

      if (type === 'standard') setSelectedFile(file);
      if (type === 'aadhaar') setAadhaarFile(file);
      if (type === 'gst') setGstFile(file);
      if (type === 'pan') setPanFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const onSubmit = async (data: VendorFormValues) => {
    setIsSubmitting(true);
    setServerError("");
    setFileError("");

    try {
      let finalDocData: any = {};

      if (selectedCategory === "HOTEL_HOMESTAY") {
        if (!aadhaarFile || !gstFile || !panFile) {
          throw new Error("All 3 documents (Aadhaar, GST, and PAN) are mandatory for this category.");
        }
        
        // Sequential uploads wrapped in try/catch for atomicity requirement
        const aadhaarUrl = await uploadFile(aadhaarFile);
        const gstUrl = await uploadFile(gstFile);
        const panUrl = await uploadFile(panFile);

        finalDocData = { aadhaarUrl, gstUrl, panUrl };
      } else {
        if (!selectedFile) {
          throw new Error("Government ID document is required for verification");
        }
        const governmentIdUrl = await uploadFile(selectedFile);
        finalDocData = { governmentIdUrl };
      }

      const res = await registerVendor({ ...data, ...finalDocData });
      
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setServerError(res?.error || "Registration failed");
      }
    } catch (error: any) {
      setServerError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const cityObj = NORTHEAST_CITIES.find(c => c.city === cityName);
    if (cityObj) {
      setValue("city", cityName);
      setValue("state", cityObj.state);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-nature-50 flex flex-col justify-center items-center p-6 pt-24">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
          <h2 className="font-serif text-2xl font-bold text-nature-900 mb-2">Account Created!</h2>
          <p className="text-nature-600 mb-6">Your vendor account has been created successfully.</p>
          <p className="text-sm text-nature-500">Redirecting to login so you can complete onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24">
      <div className="page-container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-nature-900 mb-4">Partner With Us</h1>
          <p className="text-nature-600">Join the largest network of verified tourism vendors in Northeast India. (Step 1 of 2)</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-nature-100">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Vendor Type Selection */}
            <div>
              <label className="block text-sm font-bold text-nature-900 mb-2">Service Category *</label>
              <select 
                {...register("serviceCategory")}
                className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500"
              >
                <option value="HOTEL_HOMESTAY">Hotel / Homestay / Lodge</option>
                <option value="TOUR_OPERATOR">Tour Operator / Travel Agent</option>
                <option value="TOUR_GUIDE">Local Tour Guide</option>
                <option value="FOOD_CAFE">Food & Café / Restaurant</option>
                <option value="HOSPITAL_PHARMACY">Hospital / Pharmacy & Others</option>
              </select>
              {errors.serviceCategory && <p className="text-red-500 text-xs mt-1">{errors.serviceCategory.message}</p>}
            </div>

            <hr className="border-nature-100" />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Business/Entity Name *</label>
                <input {...register("businessName")} placeholder="e.g. Ziro Valley Resort" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Owner Full Name *</label>
                <input {...register("ownerName")} placeholder="John Doe" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
              </div>
            </div>

            {/* Contact & Auth Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Email Address *</label>
                <input type="email" {...register("email")} placeholder="contact@business.com" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Phone Number *</label>
                <input {...register("phone")} placeholder="+91 9876543210" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Password *</label>
                <input type="password" {...register("password")} placeholder="Min 8 chars, 1 num, 1 special" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">Confirm Password *</label>
                <input type="password" {...register("confirmPassword")} placeholder="Repeat password" className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">City *</label>
                <select onChange={handleCityChange} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" defaultValue="">
                  <option value="" disabled>Select City</option>
                  {NORTHEAST_CITIES.map(c => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-nature-900 mb-2">State *</label>
                <input {...register("state")} readOnly className="w-full bg-gray-100 border border-nature-200 rounded-xl px-4 py-3 text-nature-600 focus:outline-none" placeholder="Auto-filled" />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-nature-900 mb-2">Full Address *</label>
                <textarea {...register("address")} rows={2} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500" placeholder="Street layout and area" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>

            <hr className="border-nature-100" />
            
            {/* Identity Verification */}
            <div>
              <h3 className="font-bold text-nature-900 mb-4 text-lg">Identity Verification</h3>
              
              {selectedCategory === "HOTEL_HOMESTAY" ? (
                <div className="space-y-6">
                  <p className="text-sm text-nature-600 mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <span>For the Hotel/Homestay/Lodge category, you must upload all three mandatory documents for verification.</span>
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-nature-900 mb-2">Upload Owner Aadhaar Card *</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'aadhaar')} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm" />
                      {aadhaarFile && <p className="text-green-600 text-xs mt-1">✓ {aadhaarFile.name} ready</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-nature-900 mb-2">Upload GST Certificate (Business) *</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'gst')} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm" />
                      {gstFile && <p className="text-green-600 text-xs mt-1">✓ {gstFile.name} ready</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-nature-900 mb-2">Upload PAN Card (Owner or Business) *</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'pan')} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2 text-sm" />
                      {panFile && <p className="text-green-600 text-xs mt-1">✓ {panFile.name} ready</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-nature-600 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <span>Upload any one valid government-approved ID such as Aadhaar Card, PAN Card, or Business Registration.</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-nature-900 mb-2">Document Type *</label>
                      <select {...register("governmentIdType")} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none">
                        <option value="" disabled>Select ID Type</option>
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="GST">GST Certificate</option>
                        <option value="BUSINESS_REG">Business Registration</option>
                        <option value="OTHER">Other Govt ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-nature-900 mb-2">Upload File *</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'standard')} className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-2.5 text-sm" />
                      {selectedFile && <p className="text-green-600 text-xs mt-1">✓ {selectedFile.name} ready</p>}
                    </div>
                  </div>
                </div>
              )}
              {fileError && <p className="text-red-500 text-xs mt-4 font-bold">{fileError}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-earth-500 hover:bg-earth-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Continue to Onboarding"}
            </button>
            <p className="text-center text-sm text-nature-500 pt-4">Already have an account? <Link href="/vendor/login" className="text-earth-600 font-bold hover:underline">Login here</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
