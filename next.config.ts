import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.wainroutes.co.uk",
        pathname: "/**",
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/download/gpx/:slug',
        destination: '/api/download-gpx/:slug',
      },
    ]
  },
};

export default nextConfig;
