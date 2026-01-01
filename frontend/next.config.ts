import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả HTTPS domains
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;