import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [new URL('https://img.clerk.com/**'), new URL('https://**.ufs.sh/**')],
  },
};

export default nextConfig;
