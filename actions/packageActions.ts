"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

/**
 * Standard server-side error logger.
 */
function logError(action: string, error: any) {
  console.error(`[action:${action}] error:`, {
    message: error?.message || "Unknown error",
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });
}

export async function createPackage(vendorId: string, data: any, itinerary: any[]): Promise<ActionResponse> {
  try {
    const newPackage = await prisma.package.create({
      data: {
        vendorId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        durationDays: Number(data.durationDays),
        durationNights: Number(data.durationNights),
        city: data.city,
        destinations: JSON.stringify(data.destinations || []),
        includes: JSON.stringify(data.includes || []),
        excludes: JSON.stringify(data.excludes || []),
        highlights: JSON.stringify(data.highlights || []),
        images: JSON.stringify(data.images || []),
        isFeatured: false,
        status: "PENDING_APPROVAL",
        itinerary: {
          create: itinerary.map((item: any, i: number) => ({
            day: item.day || i + 1,
            title: item.title,
            description: item.description,
          })),
        },
      },
    });

    revalidatePath("/vendor/dashboard/packages");
    revalidatePath("/admin/packages");
    return { success: true, message: "Package created and sent for approval.", data: newPackage };
  } catch (err: any) {
    logError("createPackage", err);
    return { success: false, message: "Failed to create package.", error: err.message };
  }
}

export async function updatePackage(id: string, vendorId: string, data: any, itinerary: any[]): Promise<ActionResponse> {
  try {
    // Verify ownership
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendorId) {
      return { success: false, message: "Unauthorized: You do not own this package." };
    }

    // If approved, editing forces it back to NEEDS_REVIEW
    const newStatus = existing.status === "APPROVED" ? "NEEDS_REVIEW" : existing.status;

    // Transaction to update package and replace itinerary
    const result = await prisma.$transaction(async (tx) => {
      await tx.packageItinerary.deleteMany({ where: { packageId: id } });
      const pkg = await tx.package.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          price: Number(data.price),
          durationDays: Number(data.durationDays),
          durationNights: Number(data.durationNights),
          city: data.city,
          destinations: JSON.stringify(data.destinations || []),
          includes: JSON.stringify(data.includes || []),
          excludes: JSON.stringify(data.excludes || []),
          highlights: JSON.stringify(data.highlights || []),
          images: JSON.stringify(data.images || []),
          status: newStatus,
          itinerary: {
            create: itinerary.map((item: any, i: number) => ({
              day: item.day || i + 1,
              title: item.title,
              description: item.description,
            })),
          },
        },
      });
      return pkg;
    });

    revalidatePath("/vendor/dashboard/packages");
    revalidatePath("/admin/packages");
    if (existing.status === "APPROVED") {
      revalidatePath("/packages");
      revalidatePath(`/destinations/${data.city.toLowerCase()}`);
    }
    
    return { success: true, message: "Package updated and sent for re-approval.", data: result };
  } catch (err: any) {
    logError("updatePackage", err);
    return { success: false, message: "Failed to update package.", error: err.message };
  }
}

export async function deletePackage(id: string, vendorId: string): Promise<ActionResponse> {
  try {
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing || existing.vendorId !== vendorId) {
      return { success: false, message: "Unauthorized: You do not own this package." };
    }

    await prisma.package.delete({ where: { id } });
    revalidatePath("/vendor/dashboard/packages");
    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    return { success: true, message: "Package deleted successfully." };
  } catch (err: any) {
    logError("deletePackage", err);
    return { success: false, message: "Failed to delete package.", error: err.message };
  }
}

export async function getPackagesByVendor(vendorId: string): Promise<ActionResponse> {
  try {
    const packages = await prisma.package.findMany({
      where: { vendorId },
      include: { itinerary: { orderBy: { day: 'asc' } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Vendor packages fetched.", data: packages };
  } catch (err: any) {
    logError("getPackagesByVendor", err);
    return { success: false, message: "Failed to fetch vendor packages.", error: err.message };
  }
}

export async function getPendingPackages(): Promise<ActionResponse> {
  try {
    const packages = await prisma.package.findMany({
      where: {
        status: {
          in: ["PENDING_APPROVAL", "NEEDS_REVIEW"],
        },
      },
      include: { vendor: true, itinerary: { orderBy: { day: 'asc' } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Pending packages fetched.", data: packages };
  } catch (err: any) {
    logError("getPendingPackages", err);
    return { success: false, message: "Failed to fetch pending packages.", error: err.message };
  }
}

export async function updatePackageStatus(id: string, status: string): Promise<ActionResponse> {
  try {
    const updated = await prisma.package.update({
      where: { id },
      data: { status },
      include: { vendor: true }
    });
    
    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    revalidatePath(`/destinations/${updated.city.toLowerCase()}`);
    return { success: true, message: `Package status updated to ${status}.`, data: updated };
  } catch (err: any) {
    logError("updatePackageStatus", err);
    return { success: false, message: "Failed to update package status.", error: err.message };
  }
}

export async function getApprovedPackages(city?: string): Promise<ActionResponse> {
  try {
    const where: any = { status: "APPROVED" };
    if (city) {
      where.city = city;
    }
    const packages = await prisma.package.findMany({
      where,
      include: { vendor: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Approved packages fetched.", data: packages };
  } catch (err: any) {
    logError("getApprovedPackages", err);
    return { success: false, message: "Failed to fetch approved packages.", error: err.message };
  }
}

export async function getPackageBySlug(slug: string): Promise<ActionResponse> {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: { vendor: true, itinerary: { orderBy: { day: 'asc' } } },
    });
    if (!pkg) return { success: false, message: "Package not found." };
    return { success: true, message: "Package details fetched.", data: pkg };
  } catch (err: any) {
    logError("getPackageBySlug", err);
    return { success: false, message: "Failed to fetch package details.", error: err.message };
  }
}
