import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();

  return Response.json({
    requestId: headersList.get('x-request-id'),
    pathname: headersList.get('x-pathname'),
    regionVariant: headersList.get('x-region-variant'),
    timestamp: new Date().toISOString(),
  });
}
