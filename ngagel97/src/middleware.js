import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/register", "/login", "/home", "/product"]; // is public
const STATIC_FILE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".webp",
]; // Allowed static formats

export async function middleware(request) {
  const token = request.cookies.get("token"); // Retrieve token from cookies

  const { pathname } = request.nextUrl;
  console.log("Middleware is running. Pathname:", request.nextUrl.pathname);

  // Allow access to static files
  if (STATIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // Redirect '/' to '/home'
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Allow access to public routes without authentication
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { payload } = await jwtVerify(
    token.value,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  // console.log("Token is valid: ", payload);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token using 'jose'
    // Role-based access control logic
    const { role } = payload;

    if (pathname.startsWith("/master") && role.toLowerCase() === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname.startsWith("/master") && role.toLowerCase() !== "master") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (pathname.startsWith("/admin") && role.toLowerCase() === "master") {
      return NextResponse.redirect(new URL("/master/dashboard", request.url));
    }
    if (pathname.startsWith("/admin") && role.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Attach user data for future use in the request
    request.user = payload;

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
