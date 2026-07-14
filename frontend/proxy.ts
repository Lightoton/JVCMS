import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Auth routing
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. CSRF / Proxy host rewrite protection
  const requestHeaders = new Headers(request.headers);
  const origin = request.headers.get('origin');
  
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host; // e.g. my-domain.com or my-domain.com.
      
      const allowedDomainsStr = process.env.ALLOWED_DOMAINS || '';
      const allowedDomains = allowedDomainsStr.split(',').map(d => d.trim()).filter(Boolean);
      const localHosts = ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', 'localhost', '127.0.0.1'];
      
      // Strict CSRF verification
      if (allowedDomains.includes(originHost) || localHosts.includes(originHost)) {
        // Force the host headers to match the validated origin
        // This fixes Server Actions behind proxies like Cloudflare/Nginx
        requestHeaders.set('x-forwarded-host', originHost);
        requestHeaders.set('host', originHost);
      }
    } catch (e) {
      // Invalid origin URL, ignore
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Ensure Next.js correctly hooks into this as middleware if it expects default export
export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};