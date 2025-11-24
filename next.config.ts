import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for network interface detection issue in sandboxed environments
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      serverComponentsExternalPackages: [],
    },
  }),
  serverRuntimeConfig: {
    // Only available on the server side
  },
  publicRuntimeConfig: {
    // Shared with the client side
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "image/jpeg",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
