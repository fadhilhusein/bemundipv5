import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { isAdminEmail } from "@/lib/admins";
import { getAdminAuth } from "@/lib/firebase/admin";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  let userEmail: string | null = null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    userEmail = decoded.email ?? null;
  } catch {
    redirect("/login");
  }

  if (!(await isAdminEmail(userEmail))) {
    redirect("/login?error=forbidden");
  }

  return <DashboardShell userEmail={userEmail}>{children}</DashboardShell>;
}
