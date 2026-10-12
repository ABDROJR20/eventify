import { NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "eventify-super-secret-jwt-key-2026-secure-token";
const COOKIE_NAME = "eventify_session";

// Fast server-side cryptographic token verification
function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Next.js 16 Proxy / Middleware function
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const user = verifySessionToken(sessionCookie);

  // 1. ADMIN ROUTES (/admin/*)
  if (pathname.startsWith("/admin")) {
    const isAdminLogin = pathname === "/admin/login";

    if (isAdminLogin) {
      // If already authenticated as admin, jump straight to admin panel
      if (user && user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin routes strictly require admin role
    if (!user || user.role !== "admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. ORGANIZER DASHBOARD ROUTES (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    // If not logged in at all -> redirect to organizer login with return URL
    if (!user) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("role", "organizer");
      authUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(authUrl);
    }

    // If logged in as Attendee -> strictly block them from Organizer Dashboard!
    if (user.role === "attendee") {
      const eventsUrl = new URL("/events", request.url);
      eventsUrl.searchParams.set("error", "unauthorized_organizer");
      return NextResponse.redirect(eventsUrl);
    }

    // Verified as Organizer or Admin -> allow access
    return NextResponse.next();
  }

  // 3. USER PORTAL ROUTES (/portal/*)
  if (pathname.startsWith("/portal")) {
    if (!user) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("role", "attendee");
      authUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(authUrl);
    }

    return NextResponse.next();
  }

  // 4. AUTH PAGE (/auth)
  if (pathname === "/auth") {
    const roleParam = request.nextUrl.searchParams.get("role");
    if (user) {
      // If already logged in as organizer and accessing organizer login
      if (user.role === "organizer" && roleParam === "organizer") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // If already logged in as attendee and accessing attendee login
      if (user.role === "attendee" && roleParam === "attendee") {
        return NextResponse.redirect(new URL("/events", request.url));
      }
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/portal/:path*",
    "/auth",
  ],
};
