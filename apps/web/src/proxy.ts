import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// edgeEnvResult is computed at module load time (edge function cold start).
// If required vars are missing, we catch the failure here and return a
// human-readable 500 rather than letting Next.js surface a cryptic error.
import { edgeEnvResult } from '@/env/edge';

const COUNTRY_HEADER_NAMES = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'cloudfront-viewer-country',
] as const;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
const IP_HEADER_NAMES = [
  'cf-connecting-ip',
  'x-real-ip',
  'x-forwarded-for',
] as const;
const GEOJS_COUNTRY_ENDPOINT = 'https://get.geojs.io/v1/ip/country';
const GEO_LOOKUP_TIMEOUT_MS = 1500;
const LOCAL_DEV_HOSTS = new Set(['127.0.0.1', '::1', 'localhost']);
const REGION_COOKIE_MAX_AGE = 60 * 10;
const REGION_COOKIE_NAME = 'region-variant';
const UKRAINE_COUNTRY_CODE = 'UA';
const UKRAINE_REGION = 'ua';
const UKRAINE_REGION_PREFIX = '/ua';

type RegionVariant = 'default' | 'ua';

export default async function proxy(request: NextRequest) {
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
      }
    );
  }

  // biome-ignore lint/suspicious/noConsole: Intentional for request logging demonstration
  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`);

  const pathname = request.nextUrl.pathname;

  // Create a request headers object with additional headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', crypto.randomUUID());
  requestHeaders.set('x-pathname', pathname);

  if (isUkraineVariantPath(pathname)) {
    requestHeaders.set('x-region-variant', UKRAINE_REGION);

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = stripUkrainePrefix(pathname);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    return finalizeResponse(response, requestHeaders, UKRAINE_REGION);
  }

  requestHeaders.set('x-region-variant', 'default');

  const cachedRegion = parseRegionVariant(
    request.cookies.get(REGION_COOKIE_NAME)?.value
  );
  if (cachedRegion === UKRAINE_REGION && shouldEvaluateGeo(request)) {
    return createUkraineRedirectResponse(request, requestHeaders);
  }

  let regionCookieToPersist: RegionVariant | null = null;
  if (!cachedRegion && shouldEvaluateGeo(request)) {
    const countryCode = await resolveCountryCode(request);
    if (countryCode === UKRAINE_COUNTRY_CODE) {
      return createUkraineRedirectResponse(request, requestHeaders);
    }

    regionCookieToPersist = 'default';
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return finalizeResponse(response, requestHeaders, regionCookieToPersist);
}

function isUkraineVariantPath(pathname: string) {
  return (
    pathname === UKRAINE_REGION_PREFIX ||
    pathname.startsWith(`${UKRAINE_REGION_PREFIX}/`)
  );
}

function stripUkrainePrefix(pathname: string) {
  const strippedPathname = pathname.slice(UKRAINE_REGION_PREFIX.length);

  return strippedPathname === '' ? '/' : strippedPathname;
}

function shouldEvaluateGeo(request: NextRequest) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return false;
  }

  const pathname = request.nextUrl.pathname;
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return false;
  }

  return !isPrefetchRequest(request);
}

function isPrefetchRequest(request: NextRequest) {
  return (
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch'
  );
}

function parseRegionVariant(
  regionVariant: string | undefined
): RegionVariant | null {
  return regionVariant === 'default' || regionVariant === UKRAINE_REGION
    ? regionVariant
    : null;
}

function resolveCountryCode(request: NextRequest) {
  const developmentCountryOverride = getDevelopmentCountryOverride(request);
  if (developmentCountryOverride) {
    return developmentCountryOverride;
  }

  for (const headerName of COUNTRY_HEADER_NAMES) {
    const countryCode = normalizeCountryCode(request.headers.get(headerName));
    if (countryCode) {
      return countryCode;
    }
  }

  const clientIp = getClientIp(request);
  if (!clientIp) {
    return isLocalDevelopmentRequest(request) ? lookupCountryCode() : null;
  }

  return lookupCountryCode(clientIp);
}

function getDevelopmentCountryOverride(request: NextRequest) {
  if (!isLocalDevelopmentRequest(request)) {
    return null;
  }

  return normalizeCountryCode(request.nextUrl.searchParams.get('geo-country'));
}

function isLocalDevelopmentRequest(request: NextRequest) {
  return LOCAL_DEV_HOSTS.has(request.nextUrl.hostname);
}

async function lookupCountryCode(clientIp?: string) {
  const lookupUrl = clientIp
    ? `${GEOJS_COUNTRY_ENDPOINT}/${encodeURIComponent(clientIp)}.json`
    : `${GEOJS_COUNTRY_ENDPOINT}.json`;

  try {
    const response = await fetch(lookupUrl, {
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(GEO_LOOKUP_TIMEOUT_MS),
    });

    if (!response.ok) {
      // biome-ignore lint/suspicious/noConsole: Intentional fallback logging for geo lookup failures
      console.warn(
        `[Proxy] GeoJS lookup failed with status ${response.status}`
      );
      return null;
    }

    const payload = (await response.json()) as { country?: unknown };

    return typeof payload.country === 'string'
      ? normalizeCountryCode(payload.country)
      : null;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';

    // biome-ignore lint/suspicious/noConsole: Intentional fallback logging for geo lookup failures
    console.warn(`[Proxy] GeoJS lookup failed: ${message}`);
    return null;
  }
}

function getClientIp(request: NextRequest) {
  for (const headerName of IP_HEADER_NAMES) {
    const headerValue = request.headers.get(headerName);
    if (!headerValue) {
      continue;
    }

    const firstValue = headerValue.split(',')[0]?.trim();
    if (firstValue) {
      return firstValue;
    }
  }

  return null;
}

function normalizeCountryCode(countryCode: string | null) {
  if (!countryCode) {
    return null;
  }

  const normalizedCountryCode = countryCode.trim().toUpperCase();

  return COUNTRY_CODE_PATTERN.test(normalizedCountryCode)
    ? normalizedCountryCode
    : null;
}

function createUkraineRedirectResponse(
  request: NextRequest,
  requestHeaders: Headers
) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname =
    redirectUrl.pathname === '/'
      ? UKRAINE_REGION_PREFIX
      : `${UKRAINE_REGION_PREFIX}${redirectUrl.pathname}`;

  const response = NextResponse.redirect(redirectUrl);

  return finalizeResponse(response, requestHeaders, UKRAINE_REGION);
}

function finalizeResponse(
  response: NextResponse,
  requestHeaders: Headers,
  regionVariant: RegionVariant | null
) {
  if (regionVariant) {
    response.cookies.set(REGION_COOKIE_NAME, regionVariant, {
      httpOnly: true,
      maxAge: REGION_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });
  }

  // Security headers on the response
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'X-Request-Id',
    requestHeaders.get('x-request-id') || ''
  );

  return response;
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
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
