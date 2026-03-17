import type { NextConfig } from 'next';

const blogUrl = process.env.BLOG_URL;

const nextConfig: NextConfig = {
  assetPrefix: blogUrl,
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
