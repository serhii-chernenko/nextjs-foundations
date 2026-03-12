import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// edgeEnvResult is computed at module load time (edge function cold start).
// If required vars are missing, we catch the failure here and return a
// human-readable 500 rather than letting Next.js surface a cryptic error.
import { edgeEnvResult } from '@/env/edge';

export default function proxy(_request: NextRequest) {
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

  // Edge env is validated. edgeEnv is now non-null and fully typed.
  // Add auth checks, request rewrites, custom headers, etc. here.
  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
