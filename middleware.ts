import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
