import type { NextConfig } from 'next';

const BLOG_PROJECT_PREFIX = 'nextjs-foundations-blog-';
const TRAILING_SLASH_PATTERN = /\/$/;
const WEB_PROJECT_PREFIX = 'nextjs-foundations-web-';

function normalizeUrl(url: string) {
  return url.replace(TRAILING_SLASH_PATTERN, '');
}

function getBlogUrl() {
  if (
    process.env.VERCEL_ENV === 'preview' &&
    process.env.VERCEL_BRANCH_URL?.startsWith(WEB_PROJECT_PREFIX)
  ) {
    const blogBranchUrl = process.env.VERCEL_BRANCH_URL.replace(
      WEB_PROJECT_PREFIX,
      BLOG_PROJECT_PREFIX
    );

    return `https://${blogBranchUrl}`;
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