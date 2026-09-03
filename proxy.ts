import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "impact_admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "impact-b2b-secure-jwt-secret-key-2026-cpanel-node"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page, static files, and public APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/images") ||
    pathname === "/admin/login" ||
    pathname.startsWith("/api/auth/") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/"))
  ) {
    // If logged-in user visits /admin/login, redirect to /admin/dashboard
    if (pathname === "/admin/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET);
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } catch {
          // Token expired or invalid, let them view login page
        }
      }
    }
    return NextResponse.next();
  }

  // Check if route requires admin authentication
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized: Active session required" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Redirect root /admin or /admin/ to /admin/dashboard
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // RBAC: Check admin-only routes
    const isAdminOnlyRoute =
      pathname.startsWith("/admin/users") ||
      pathname.startsWith("/api/admin/users");

    if (isAdminOnlyRoute && role !== "ADMIN") {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Forbidden: Admin privileges required" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(
        new URL("/admin/dashboard?error=access_denied", request.url)
      );
    }

    // Set user headers for downstream server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", (payload.id as string) || "");
    requestHeaders.set("x-user-email", (payload.email as string) || "");
    requestHeaders.set("x-user-role", role || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Invalid or expired token
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please re-authenticate." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
