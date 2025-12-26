import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/signup', '/'];
  const isPublicRoute = pathname === '/' || 
                       pathname === '/login' || 
                       pathname === '/signup' || 
                       pathname.startsWith('/api/auth');
  
  // For API routes, let them handle auth themselves
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for NextAuth session cookie
  // NextAuth v5 uses different cookie names
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                        request.cookies.get('__Secure-authjs.session-token') ||
                        request.cookies.get('next-auth.session-token') ||
                        request.cookies.get('__Secure-next-auth.session-token');
  
  const hasSession = !!sessionCookie;

  // Redirect to login if accessing protected route without session
  if (!isPublicRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login/signup to dashboard
  if (hasSession && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg (icon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

