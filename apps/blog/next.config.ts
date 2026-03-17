import type { NextConfig } from 'next';

const blogDomain = process.env.BLOG_DOMAIN || 'https://nextjs-foundations-blog.chernenko.dev';

const nextConfig: NextConfig = {
  assetPrefix: blogDomain,
  // biome-ignore lint/suspicious/useAwait: No async operations needed here, but Next.js expects a promise
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  }
};

export default nextConfig;
