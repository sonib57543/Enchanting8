"use server";

import { prisma } from "@/lib/prisma";
import { saveUploadedFile, saveUploadedFiles } from "@/lib/uploadHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function submitOnboarding(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const vendor = await prisma.vendor.findFirst({
      where: { email: session.user.email, status: "PENDING_ONBOARDING" }
    });

    if (!vendor) {
      return { success: false, error: "Vendor not found or not in onboarding state" };
    }

    const details: Record<string, any> = {};

    // Map all text fields and ignore files for this loop
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && !["photos", "menuFile", "documents", "amenitiesStr"].includes(key)) {
        details[key] = value;
      }
    }

    // Handle files - Photos
    const photos = formData.getAll("photos") as File[];
    const validPhotos = photos.filter(f => f.size > 0);
    if (validPhotos.length > 0) {
      details.photos = await saveUploadedFiles(validPhotos, "vendors/photos");
    }

    // Handle files - Menu
    const menuFile = formData.get("menuFile") as File;
    if (menuFile && menuFile.size > 0) {
      details.menuFile = await saveUploadedFile(menuFile, "vendors/menus");
    }

    // Handle files - Documents
    const documents = formData.getAll("documents") as File[];
    const validDocs = documents.filter(f => f.size > 0);
    if (validDocs.length > 0) {
      details.documents = await saveUploadedFiles(validDocs, "vendors/documents");
    }
    
    // Parse Amenities JSON
    const amenitiesStr = formData.get("amenitiesStr") as string;
    if (amenitiesStr) {
      try {
        details.amenities = JSON.parse(amenitiesStr);
      } catch {
        details.amenities = [];
      }
    }

    // Update Vendor dynamically based on parsed data and files
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        vendorDetails: JSON.stringify(details),
        status: "PENDING_APPROVAL",
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Onboarding submission error:", error);
    return { success: false, error: error.message || "Failed to submit onboarding" };
  }
}
