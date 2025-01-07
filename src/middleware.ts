import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET
);

// Verify JWT Token
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    console.log("[Middleware] JWT Payload:", payload); // Debug log
    return payload.UserInfo || null;
  } catch (error) {
    console.error("[Middleware] JWT verification failed:", error);
    return null;
  }
}

// Middleware
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.warn("[Middleware] No access token; redirecting to /auth/signin.");
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const user = await verifyToken(accessToken);

  if (!user) {
    console.warn(
      "[Middleware] Invalid access token; redirecting to /auth/signin."
    );
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  console.log("[Middleware] Verified User:", user);

  // Optional: Redirect to the appropriate dashboard based on userType
  const dashboardRoutes = {
    staff: "/admin/dashboard",
    guardian: "/guardian/dashboard",
    student: "/student/dashboard",
  };

  if (pathname === "/" || pathname === "/auth/signin") {
    const userDashboard =
      dashboardRoutes[user.userType?.toLowerCase()] || "/auth/disabled";
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/guardian/:path*"],
};
