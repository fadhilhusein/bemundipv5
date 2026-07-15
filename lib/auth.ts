import "server-only";

import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/admins";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function requireSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie);
    if (!(await isAdminEmail(decoded.email))) return null;
    return decoded;
  } catch {
    return null;
  }
}
