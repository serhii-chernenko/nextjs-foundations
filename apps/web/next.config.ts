import type { NextConfig } from 'next';

const blogUrl = (process.env.BLOG_URL || 'http://localhost:3001').replace(
  /\/$/,
  ''
);
 
const nextConfig: NextConfig = {
  // Keep a trailing slash for blog index so relative post links stay under /blog/
  // biome-ignore lint/suspicious/useAwait: No async operations needed here, but Next.js expects a promise
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/',
        permanent: false,
      },
    ];
  },

  // biome-ignore lint/suspicious/useAwait: No async operations needed here, but Next.js expects a promise
  async rewrites() {
    return {
      beforeFiles: [
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