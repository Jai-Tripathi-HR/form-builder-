import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/",
        permanent: true,
      },
      {
        source: "/registration",
        destination: "/",
        permanent: false,
      },
      {
        source: "/form",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
