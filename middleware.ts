import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require admin authentication
const PROTECTED_ROUTES = ['/admin'];

// Cookie name for admin session
const ADMIN_SESSION_COOKIE = 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected admin route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Allow access to the admin login page
  if (pathname === '/admin' || pathname === '/admin/login') {
    // If already authenticated, redirect to dashboard
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);
    if (session?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin/programs', request.url));
    }
    return NextResponse.next();
  }

  // Check for admin session cookie
  const session = request.cookies.get(ADMIN_SESSION_COOKIE);

  if (!session || session.value !== 'authenticated') {
    // Redirect to admin login page
    const loginUrl = new URL('/admin', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
