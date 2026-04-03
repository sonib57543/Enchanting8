import { Vendor } from "@/types";

const STORAGE_KEY = "ne_tourism_dynamic_vendors";

export const getStoredVendors = (): Vendor[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveVendor = (vendor: Omit<Vendor, "id" | "status" | "submittedAt">) => {
  if (typeof window === "undefined") return;
  const existing = getStoredVendors();
  const newVendor: Vendor = {
    ...vendor,
    id: `v-dyn-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newVendor]));
  return newVendor;
};

// Legacy: now vendors are managed fully via Prisma in admin routes.
// This returns only any locally-stored (client-side) vendor records.
export const getAllVendors = (): Vendor[] => {
  return getStoredVendors();
};
