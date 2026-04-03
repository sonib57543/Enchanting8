"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateContactSettings({
  facebookLink,
  instagramLink,
  twitterLink,
  ...restData
}: any) {
  const existing = await prisma.contactSetting.findFirst();

  const socialLinks = JSON.stringify({
    facebookLink: facebookLink || "",
    instagramLink: instagramLink || "",
    twitterLink: twitterLink || ""
  });

  const prismaData = {
    ...restData,
    socialLinks
  };

  let settings;
  if (existing) {
    settings = await prisma.contactSetting.update({
      where: { id: existing.id },
      data: prismaData,
    });
  } else {
    settings = await prisma.contactSetting.create({
      data: prismaData as any,
    });
  }
  
  revalidatePath("/admin/contact-settings");
  revalidatePath("/contact");
  revalidatePath("/");
  return settings;
}

export async function getContactSettings() {
  return await prisma.contactSetting.findFirst();
}
