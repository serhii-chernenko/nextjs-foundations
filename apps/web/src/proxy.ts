import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// edgeEnvResult is computed at module load time (edge function cold start).
// If required vars are missing, we catch the failure here and return a
// human-readable 500 rather than letting Next.js surface a cryptic error.
import { edgeEnvResult } from '@/env/edge';

export default function proxy(request: NextRequest) {
  if (!edgeEnvResult.success) {
    const issues = edgeEnvResult.error.issues
      .map((issue) => `${String(issue.path[0] ?? 'unknown')}: ${issue.message}`)
      .join('; ');

    return new NextResponse(
      JSON.stringify({
        error: 'Server misconfiguration — invalid environment variables',
        issues,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // biome-ignore lint/suspicious/noConsole: Intentional for request logging demonstration
  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`)
 
  // Create a request headers object with additional headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', crypto.randomUUID())
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
 
  // Continue to route with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
 
  // Security headers on the response
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Request-Id', requestHeaders.get('x-request-id') || '')
 
  return response
}

// Configure which paths run the proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

