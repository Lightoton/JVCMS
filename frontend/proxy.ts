import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  const origin = request.headers.get('origin');
  
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host;
      
      const allowedDomainsStr = process.env.ALLOWED_DOMAINS || '';
      const allowedDomains = allowedDomainsStr.split(',').map(d => d.trim()).filter(Boolean);
      const localHosts = ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', 'localhost', '127.0.0.1'];
      
      if (allowedDomains.includes(originHost) || localHosts.includes(originHost)) {
        requestHeaders.set('x-forwarded-host', originHost);
        requestHeaders.set('host', originHost);
      }
    } catch (e) {
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

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