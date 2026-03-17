import type { NextConfig } from 'next';

const PREVIEW_BLOG_PREFIX = 'nextjs-foundations-b';
const PREVIEW_WEB_PREFIX = 'nextjs-foundations-w';
const TRAILING_SLASH_PATTERN = /\/$/;

function normalizeUrl(url: string) {
  return url.replace(TRAILING_SLASH_PATTERN, '');
}

function mapWebPreviewHostToBlogHost(host: string) {
  if (!host.startsWith(PREVIEW_WEB_PREFIX)) {
    return null;
  }

  return `${PREVIEW_BLOG_PREFIX}${host.slice(PREVIEW_WEB_PREFIX.length)}`;
}

function getBlogUrl() {
  if (process.env.VERCEL_ENV === 'preview') {
    const webPreviewHost =
      process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
    if (webPreviewHost) {
      const mappedBlogHost = mapWebPreviewHostToBlogHost(webPreviewHost);
      if (mappedBlogHost) {
        return `https://${mappedBlogHost}`;
      }
    }
  }

  return normalizeUrl(process.env.BLOG_URL || 'http://localhost:3001');
}

const blogUrl = getBlogUrl();
 
const nextConfig: NextConfig = {
  // biome-ignore lint/suspicious/useAwait: No async operations needed here, but Next.js expects a promise
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/blog',
          destination: `${blogUrl}`,
        },
        {
          source: '/blog/:path*',
          destination: `${blogUrl}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};
 
export default nextConfig;