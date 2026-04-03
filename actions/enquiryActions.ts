"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEnquiries() {
  return await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentEnquiries(limit: number = 5) {
  return await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getEnquiryById(id: string) {
  return await prisma.enquiry.findUnique({ where: { id } });
}

export async function createEnquiry(data: { name: string; email: string; phone: string; destination: string; message: string }) {
  const enquiry = await prisma.enquiry.create({
    data: {
      ...data,
      status: "NEW",
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { success: true, enquiry };
}

export async function updateEnquiryStatus(id: string, status: string) {
  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { success: true, enquiry };
}

export async function deleteEnquiry(id: string) {
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { success: true };
}
