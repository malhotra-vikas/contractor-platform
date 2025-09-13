import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySimpleToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/products"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If accessing a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decoded = verifySimpleToken(token)

    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Role-based route protection
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (pathname.startsWith("/dashboard") && decoded.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
