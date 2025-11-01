/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce-api.wildfleet.net',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
}

export default nextConfig
