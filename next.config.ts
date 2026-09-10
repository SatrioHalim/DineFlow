import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "standalone", // kalau pake docker, kalau ga nanti apus aja
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    domains: ["https://eewzdgfjjhdughlvhkvk.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eewzdgfjjhdughlvhkvk.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
