import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest): NextResponse {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie && request.nextUrl.pathname.startsWith("/task")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/task/:path*" ],
};
