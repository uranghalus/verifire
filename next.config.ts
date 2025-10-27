import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  allowedDevOrigins: ['192.168.91.37'],
};

export default nextConfig;
