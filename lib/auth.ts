import "server-only";

import { cookies } from "next/headers";
import { getAdminRole } from "@/lib/admins";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function requireSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie);
    const role = await getAdminRole(decoded.email);
    if (!role) return null;
    return { ...decoded, role };
  } catch {
    return null;
  }
}

export async function requireMasterSession() {
  const session = await requireSession();
  if (!session || session.role !== "master") return null;
  return session;
}
