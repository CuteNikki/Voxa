import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://img.clerk.com/**'), new URL('https://**.ufs.sh/**')],
  },
};

export default nextConfig;
