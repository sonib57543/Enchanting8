"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerVendor(data: any) {
  try {
    const { 
      businessName, 
      ownerName, 
      phone, 
      email, 
      password, 
      serviceCategory, 
      city, 
      state, 
      address,
      governmentIdType,
      governmentIdUrl,
      aadhaarUrl,
      gstUrl,
      panUrl
    } = data;
    
    // Check if user already exists
    const existing = await prisma.vendor.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email is already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save to DB (Step 1 of Registration workflow)
    await prisma.vendor.create({
      data: {
        businessName,
        ownerName,
        phone,
        email,
        password: hashedPassword,
        serviceCategory,
        city,
        state,
        address,
        governmentIdType,
        governmentIdUrl,
        aadhaarUrl,
        gstUrl,
        panUrl,
        status: "PENDING_ONBOARDING",
        verificationStatus: "PENDING",
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Vendor registration error:", error);
    return { success: false, error: error.message || "An error occurred during registration" };
  }
}
