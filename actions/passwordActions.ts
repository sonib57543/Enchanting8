"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changeAdminPassword(email: string, currentPass: string, newPass: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: "Admin account not found." };
    }

    // Since we originally seeded with a plaintext check fallback or bcrypt, we should handle it robustly.
    const isValid = await bcrypt.compare(currentPass, admin.password);
    
    // Emergency fallback if they used the .env seed
    const isEnvMatch = currentPass === process.env.ADMIN_PASSWORD;

    if (!isValid && !isEnvMatch) {
      return { success: false, error: "Incorrect current password." };
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update password." };
  }
}
