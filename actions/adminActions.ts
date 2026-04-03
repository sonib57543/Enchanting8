"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types";

export async function getDashboardOverview(): Promise<ActionResponse> {
  try {
    const [
      totalCities,
      totalStates,
      totalVendors,
      approvedVendors,
      pendingVendors,
      rejectedVendors,
      totalPackages,
      totalBlogs,
      newEnquiries,
      totalEnquiries
    ] = await Promise.all([
      prisma.city.count(),
      prisma.state.count(),
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: "APPROVED" } }),
      prisma.vendor.count({ where: { status: { in: ["PENDING_ONBOARDING", "PENDING_APPROVAL", "NEEDS_REVIEW", "PENDING"] } } }),
      prisma.vendor.count({ where: { status: "REJECTED" } }),
      prisma.package.count(),
      prisma.blog.count(),
      prisma.enquiry.count({ where: { status: { in: ["NEW", "OPEN"] } } }),
      prisma.enquiry.count()
    ]);

    return {
      success: true,
      message: "Dashboard data fetched.",
      data: {
        destinations: totalCities + totalStates,
        cities: totalCities,
        vendors: {
          total: totalVendors,
          approved: approvedVendors,
          pending: pendingVendors,
          rejected: rejectedVendors
        },
        packages: totalPackages,
        blogs: totalBlogs,
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries
        }
      }
    };
  } catch (err: any) {
    console.error("[action:getDashboardOverview] error:", err);
    return { success: false, message: "Failed to fetch dashboard stats.", error: err.message };
  }
}
