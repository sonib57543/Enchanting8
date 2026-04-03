"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "@/types";

// --- Validation Schemas ---
const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  vendorType: z.string(),
  city: z.string(),
  address: z.string(),
  description: z.string().optional(),
  services: z.string().optional(),
});

/**
 * Standard server-side error logger.
 */
function logError(action: string, error: any) {
  console.error(`[action:${action}] error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Public Data Scrubbing: Remove sensitive URLs like Aadhaar/PAN/GST docs.
 */
function scrubVendor(vendor: any) {
  if (!vendor) return null;
  const { aadhaarUrl, panUrl, gstUrl, governmentIdUrl, ...publicData } = vendor;
  return publicData;
}

export async function createVendor(data: any): Promise<ActionResponse> {
  try {
    const validated = vendorSchema.parse(data);
    const vendor = await prisma.vendor.create({
      data: {
        businessName: validated.businessName,
        ownerName: validated.ownerName,
        phone: validated.phone,
        email: validated.email,
        city: validated.city,
        address: validated.address,
        serviceCategory: validated.vendorType, // Map vendorType to serviceCategory
        password: "", // Handled during onboarding
        state: "",
        status: "PENDING_ONBOARDING",
      },
    });
    
    revalidatePath("/admin/vendors");
    revalidatePath("/admin");
    
    return { 
      success: true, 
      message: "Vendor created successfully. Onboarding required.", 
      data: scrubVendor(vendor) 
    };
  } catch (err: any) {
    logError("createVendor", err);
    return { 
      success: false, 
      message: err instanceof z.ZodError ? "Invalid input data." : "Failed to create vendor.",
      error: err.message
    };
  }
}

export async function updateVendorStatus(id: string, status: string, rejectionReason?: string): Promise<ActionResponse> {
  try {
    const dataToUpdate: any = { 
      status,
      verificationStatus: status,
    };

    if (status === "REJECTED" && rejectionReason) {
      dataToUpdate.rejectionReason = rejectionReason;
    } else if (status === "APPROVED") {
      dataToUpdate.rejectionReason = null;
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: dataToUpdate,
    });
    
    revalidatePath("/admin/vendors");
    revalidatePath("/admin");
    
    return { success: true, message: `Vendor status updated to ${status}.`, data: scrubVendor(vendor) };
  } catch (err: any) {
    logError("updateVendorStatus", err);
    return { success: false, message: "Failed to update vendor status.", error: err.message };
  }
}

export async function approveVendorEdits(id: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor || !vendor.draftData) {
      return { success: false, message: "No pending edits found for this vendor." };
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        vendorDetails: vendor.draftData,
        draftData: null,
        hasPendingEdits: false,
        status: "APPROVED"
      },
    });
    
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor edits approved successfully.", data: scrubVendor(updated) };
  } catch (err: any) {
    logError("approveVendorEdits", err);
    return { success: false, message: "Failed to approve edits.", error: err.message };
  }
}

export async function deleteVendor(id: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.delete({ where: { id } });
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor deleted successfully." };
  } catch (err: any) {
    logError("deleteVendor", err);
    return { success: false, message: "Failed to delete vendor.", error: err.message };
  }
}

export async function getVendors(): Promise<ActionResponse> {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Vendors fetched successfully.", data: vendors.map(scrubVendor) };
  } catch (err: any) {
    logError("getVendors", err);
    return { success: false, message: "Failed to fetch vendors.", error: err.message };
  }
}

export async function getApprovedVendorsByCityAndCategory(city: string, serviceCategory: string): Promise<ActionResponse> {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED", city, serviceCategory },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Filtered vendors fetched successfully.", data: vendors.map(scrubVendor) };
  } catch (err: any) {
    logError("getApprovedVendorsByCityAndCategory", err);
    return { success: false, message: "Failed to fetch filtered vendors.", error: err.message };
  }
}

export async function getVendorById(id: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) return { success: false, message: "Vendor not found." };
    return { success: true, message: "Vendor fetched successfully.", data: scrubVendor(vendor) };
  } catch (err: any) {
    logError("getVendorById", err);
    return { success: false, message: "Failed to fetch vendor.", error: err.message };
  }
}

export async function deactivateVendor(id: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor deactivated.", data: scrubVendor(vendor) };
  } catch (err: any) {
    logError("deactivateVendor", err);
    return { success: false, message: "Failed to deactivate vendor.", error: err.message };
  }
}

export async function activateVendor(id: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isActive: true },
    });
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor activated.", data: scrubVendor(vendor) };
  } catch (err: any) {
    logError("activateVendor", err);
    return { success: false, message: "Failed to activate vendor.", error: err.message };
  }
}

export async function rejectVendorEdits(id: string): Promise<ActionResponse> {
  try {
    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        draftData: null,
        hasPendingEdits: false,
        status: "APPROVED"
      },
    });
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor edits rejected (restored last approved state).", data: scrubVendor(updated) };
  } catch (err: any) {
    logError("rejectVendorEdits", err);
    return { success: false, message: "Failed to reject edits.", error: err.message };
  }
}

export async function permanentDeleteVendor(id: string): Promise<ActionResponse> {
  try {
    await prisma.vendor.delete({ where: { id } });
    revalidatePath("/admin/vendors");
    return { success: true, message: "Vendor permanently deleted." };
  } catch (err: any) {
    logError("permanentDeleteVendor", err);
    return { success: false, message: "Failed to permanently delete vendor.", error: err.message };
  }
}

export async function submitVendorEdits(id: string, draftData: Record<string, unknown>, coreData?: Record<string, string>): Promise<ActionResponse> {
  try {
    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        ...(coreData || {}),
        draftData: Object.keys(draftData).length > 0 ? JSON.stringify(draftData) : null,
        hasPendingEdits: Object.keys(draftData).length > 0,
        status: "PENDING_APPROVAL", // Re-evaluation needed
        verificationStatus: "PENDING"
      },
    });
    revalidatePath("/vendor/onboarding");
    revalidatePath("/vendor/dashboard");
    return { success: true, message: "Edits submitted for review.", data: scrubVendor(updated) };
  } catch (err: any) {
    logError("submitVendorEdits", err);
    return { success: false, message: "Failed to submit edits.", error: err.message };
  }
}

export async function getVendorByEmail(email: string): Promise<ActionResponse> {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) return { success: false, message: "Vendor not found." };
    return { success: true, message: "Vendor found.", data: scrubVendor(vendor) };
  } catch (err: any) {
    logError("getVendorByEmail", err);
    return { success: false, message: "Failed to fetch vendor by email.", error: err.message };
  }
}
