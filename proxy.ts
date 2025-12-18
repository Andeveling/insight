import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Use DB-backed session check to prevent loops (redirecting users with stale cookies)
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isLoggedIn = !!session;

	// Protect dashboard routes
	if (pathname.startsWith("/dashboard") && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Redirect to dashboard if already logged in and trying to access login
	if (pathname === "/login" && isLoggedIn) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Redirect root to dashboard if logged in
	if (pathname === "/" && isLoggedIn) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/login"],
};
