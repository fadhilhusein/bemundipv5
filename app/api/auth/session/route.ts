import { type NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admins";
import { getAdminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: "idToken wajib diisi" }, { status: 400 });
  }

  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);

    if (!(await isAdminEmail(decoded.email))) {
      return NextResponse.json(
        { error: "Akun ini tidak memiliki akses admin." },
        { status: 403 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS
    });

    const response = NextResponse.json({ status: "success" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS / 1000,
      path: "/"
    });
    return response;
  } catch (err) {
    console.error("[/api/auth/session] Gagal membuat sesi:", err);
    return NextResponse.json({ error: "Gagal membuat sesi" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
