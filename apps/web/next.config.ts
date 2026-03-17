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
};
 
export default nextConfig;