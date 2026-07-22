import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    unoptimized: true,
    qualities: [100, 75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  devIndicators: {
    position: 'bottom-right', // or 'top-right'
  },
  // output: 'standalone', // only for docker if used
  // better-auth proxy
  async rewrites() {
    return [
      {
        // Explicitly map auth requests
        source: '/api/auth/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/:path*',
      },
      {
        // Explicitly map v1 API requests
        source: '/api/v1/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
