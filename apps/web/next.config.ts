import type { NextConfig } from 'next';

const TRAILING_SLASH_PATTERN = /\/$/;

function normalizeUrl(url: string) {
  return url.replace(TRAILING_SLASH_PATTERN, '');
}

function getBlogUrl() {
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
  cacheComponents: true, // Top-level in Next.js 16.1.x+
  cacheLife: {
    blog: {
      stale: 3600, // 1 hour
      revalidate: 86_400, // 24 hours
      expire: 604_800, // 1 week
    },
    products: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600, // 1 hour
    },
    social: {
      stale: 60, // 1 minute
      revalidate: 300, // 5 minutes
      expire: 600, // 10 minutes
    },
  },
};

export default nextConfig;
