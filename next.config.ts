import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rose-app.elevate-bootcamp.cloud",
        pathname: "/storage/entities/product/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
