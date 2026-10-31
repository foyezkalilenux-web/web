import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-development-key-32chars"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/staff-login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.userType !== "STAFF" || (payload.role !== "SUPER_ADMIN" && payload.role !== "INVENTORY_MANAGER")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/staff-login", req.url));
    }
  }

  // Protect POS routes
  if (pathname.startsWith("/pos")) {
    if (!token) {
      const url = new URL("/staff-login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.userType !== "STAFF" || (payload.role !== "POS_CASHIER" && payload.role !== "SUPER_ADMIN")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/staff-login", req.url));
    }
  }

  // Protect Customer Member routes
  if (pathname.startsWith("/member")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.userType !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pos/:path*", "/member/:path*"],
};
