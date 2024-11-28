import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = ['/register', '/login', '/home']; // '/dashboard' is public
const STATIC_FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp']; // Allowed static formats

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to static files
  if (STATIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // Redirect '/' to '/dashboard'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow access to public routes without authentication
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = decoded; // Extract role from the token

    // Role-based access control
    if (pathname.startsWith('/master') && role.toLowerCase() === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (pathname.startsWith('/master') && role.toLowerCase() !== 'master') {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (pathname.startsWith('/admin') && role.toLowerCase() === 'master') {
        return NextResponse.redirect(new URL('/master/dashboard', request.url));
      }
    if (pathname.startsWith('/admin') && role.toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    // Attach user data if needed for future reference
    request.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
