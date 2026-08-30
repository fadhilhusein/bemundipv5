import { redirect } from "next/navigation";
import { BidangManager } from "@/components/dashboard/BidangManager";
import { requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  if (!session) {
    redirect("/login");
  }

  return <BidangManager canManageAll={session.role !== "bidang"} />;
}
