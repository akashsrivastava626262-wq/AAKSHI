import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const isStaticExport = process.env.STATIC_EXPORT === 'true' || isGithubPages;

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export' as const,
        ...(isGithubPages
          ? { basePath: '/AAKSHI', trailingSlash: true, assetPrefix: '/AAKSHI/' }
          : { trailingSlash: true }),
      }
    : { output: 'standalone' as const }),
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://aakshi.com',
  },
  async headers() {
    if (isStaticExport) return [];
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
