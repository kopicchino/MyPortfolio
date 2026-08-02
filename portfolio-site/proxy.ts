/**
 * proxy.ts (formerly middleware.ts)
 * Next.js 16 route protection for /admin/* routes.
 * Redirects unauthenticated users to the login page.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/admin/login";

  // Allow login page for everyone
  if (isLoginPage) {
    // If already logged in, redirect to dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect all other /admin/* routes
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
