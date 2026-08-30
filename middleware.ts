import { type NextRequest, NextResponse } from "next/server";

// Lightweight edge checks — real verification is in app/dashboard/layout.tsx
// via getAdminAuth().verifySessionCookie() + getAdminSession().
// Middleware here only does cheap structural filtering to avoid hitting
// server components with obviously invalid cookies.
function hasValidJwtStructure(value: string): boolean {
  // Firebase session cookie is a JWT: header.payload.signature (3 parts)
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  if (parts.some((p) => p.length < 10)) return false;
  return true;
}

function isExpiredJwt(value: string): boolean {
  try {
    const payloadBase64 = value.split(".")[1];
    // base64url -> base64
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    if (typeof payload.exp === "number") {
      // exp is seconds since epoch
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    // if we cannot decode, treat as not expired so layout does full verify
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  // Dashboard needs a session: cheap pre-filter before server verify
  if (isDashboard) {
    if (!sessionCookie || !hasValidJwtStructure(sessionCookie) || isExpiredJwt(sessionCookie)) {
      const url = new URL("/login", request.url);
      // preserve intended destination for post-login redirect if needed
      url.searchParams.set("next", pathname);
      const res = NextResponse.redirect(url);
      // clear obviously invalid cookie so client doesn't loop with bad value
      if (sessionCookie && (!hasValidJwtStructure(sessionCookie) || isExpiredJwt(sessionCookie))) {
        res.cookies.delete("session");
      }
      return res;
    }
    return NextResponse.next();
  }

  // Already logged in but visiting /login → bounce to dashboard
  if (isLogin && sessionCookie && hasValidJwtStructure(sessionCookie) && !isExpiredJwt(sessionCookie)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
};
