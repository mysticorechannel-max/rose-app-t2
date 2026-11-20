import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

<<<<<<< HEAD
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rose-app.elevate-bootcamp.cloud",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "rose-app.elevate-bootcamp.cloud",
        pathname: "/api/upload/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
=======
export default withNextIntl({
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rose-app.elevate-bootcamp.cloud",
                pathname: "/**",
            },
        ],
    },
});
>>>>>>> origin/sprint/2-auth-home-products
