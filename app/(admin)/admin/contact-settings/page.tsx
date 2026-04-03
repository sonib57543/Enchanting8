"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getContactSettings, updateContactSettings } from "@/actions/contactActions";
import { ContactSetting } from "@prisma/client";
import { Check, Mail, Phone, MapPin, Clock, Share2 } from "lucide-react";

export default function ContactSettingsPage() {
  const [successMsg, setSuccessMsg] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  
  const { register, handleSubmit, reset } = useForm<any>({
    defaultValues: {
      supportEmail: "",
      phone: "",
      officeAddress: "",
      supportHours: "",
      whatsapp: "",
      googleMapLink: "",
      facebookLink: "",
      instagramLink: "",
      twitterLink: "",
    }
  });

  useEffect(() => {
    getContactSettings().then((settings) => {
      if (settings) {
        reset(settings);
        setLastUpdated(new Date(settings.updatedAt).toLocaleString());
      }
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    const updated = await updateContactSettings(data);
    if (updated) {
      setLastUpdated(new Date(updated.updatedAt).toLocaleString());
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-nature-900">Contact Settings</h1>
          <p className="text-nature-500 text-sm mt-0.5">Manage contact details displayed across the website.</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 font-medium text-sm px-4 py-2 rounded-xl border border-green-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4" /> Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Core Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nature-200 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-nature-600" />
            </div>
            <h2 className="font-semibold text-nature-900">Primary Contact</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nature-900">Support Email</label>
              <input 
                {...register("supportEmail", { required: true })}
                className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nature-900 flex items-center gap-2">Phone Number <Phone className="w-3.5 h-3.5 text-nature-400" /></label>
              <input 
                {...register("phone", { required: true })}
                className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-nature-900 flex items-center gap-2">WhatsApp Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-nature-200 bg-nature-100 text-nature-500">
                  WA
                </span>
                <input 
                  {...register("whatsapp")}
                  className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nature-200 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-nature-600" />
            </div>
            <h2 className="font-semibold text-nature-900">Location & Availability</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-nature-900">Office/HQ Address</label>
              <input 
                {...register("officeAddress")}
                className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nature-900 flex items-center gap-2">Support Hours <Clock className="w-3.5 h-3.5 text-nature-400" /></label>
              <input 
                {...register("supportHours")}
                placeholder="e.g. Mon-Fri 9AM to 6PM"
                className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nature-900 flex items-center gap-2">Google Maps Embed Link</label>
              <input 
                {...register("googleMapLink")}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all font-medium text-nature-700 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nature-200 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-nature-600" />
            </div>
            <h2 className="font-semibold text-nature-900">Social Media Links</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 text-center text-sm font-bold text-blue-600">FB</div>
              <input 
                {...register("facebookLink")}
                className="flex-1 px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all text-sm font-medium text-nature-700"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 text-center text-sm font-bold text-rose-500">IG</div>
              <input 
                {...register("instagramLink")}
                className="flex-1 px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all text-sm font-medium text-nature-700"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 text-center text-sm font-bold text-sky-500">TW</div>
              <input 
                {...register("twitterLink")}
                className="flex-1 px-4 py-3 bg-nature-50 border border-nature-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/20 focus:border-earth-500 transition-all text-sm font-medium text-nature-700"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-nature-500">Last updated: {lastUpdated}</p>
          <button type="submit" className="px-8 py-3 bg-nature-900 hover:bg-earth-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
