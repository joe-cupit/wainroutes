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
  }
};

export default nextConfig;
