import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getVendorById } from "@/actions/vendorActions";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/vendor/login");
  }

  const vendorId = (session.user as any).id;
  const res = await getVendorById(vendorId);

  // If vendor record was somehow deleted or missing
  if (!res.success || !res.data) {
    redirect("/vendor/login");
  }

  const vendor = res.data;

  // If newly registered, they need to complete onboarding
  if (vendor.status === "PENDING_ONBOARDING") {
    redirect("/vendor/onboarding");
  }

  return <DashboardClient initialVendor={vendor} />;
}
