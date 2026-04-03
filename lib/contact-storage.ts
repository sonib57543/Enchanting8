import { ContactSettings } from "@/types";

const STORAGE_KEY = "ne_tourism_contact_settings";

const defaultSettings: ContactSettings = {
  id: "default-contact",
  supportEmail: "hello@netourism.com",
  phoneNumber: "+91-9876543000",
  officeAddress: "123 Tourism Hub, GS Road, Guwahati, Assam - 781005",
  supportHours: "Mon - Sat, 9:00 AM - 6:00 PM",
  whatsappNumber: "+91-9876543000",
  googleMapLink: "https://maps.google.com",
  facebookLink: "https://facebook.com",
  instagramLink: "https://instagram.com",
  twitterLink: "https://twitter.com",
  updatedAt: new Date().toISOString(),
};

export const getStoredContactSettings = (): ContactSettings => {
  if (typeof window === "undefined") return defaultSettings;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
};

export const updateContactSettings = (updates: Partial<ContactSettings>) => {
  if (typeof window === "undefined") return null;
  const existing = getStoredContactSettings();
  
  const updatedSettings = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
  return updatedSettings;
};
