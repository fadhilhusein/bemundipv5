import "server-only";

import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admins";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function requireSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie);
    const adminSession = await getAdminSession(decoded.email);
    if (!adminSession) return null;
    return { ...decoded, role: adminSession.role, bidangId: adminSession.bidangId };
  } catch {
    return null;
  }
}

export async function requireMasterSession() {
  const session = await requireSession();
  if (!session || session.role !== "master") return null;
  return session;
}

/** Same as requireSession(), but rejects bidang-scoped accounts. Use for staff-only areas (Kabinet, Konten, Statistik, Master). */
export async function requireStaffSession() {
  const session = await requireSession();
  if (!session || session.role === "bidang") return null;
  return session;
}
