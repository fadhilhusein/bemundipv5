import { redirect } from "next/navigation";
import { requireMasterSession } from "@/lib/auth";

export default async function MasterLayout({ children }: { children: React.ReactNode }) {
  const session = await requireMasterSession();
  if (!session) {
    redirect("/dashboard?error=forbidden");
  }

  return <>{children}</>;
}
