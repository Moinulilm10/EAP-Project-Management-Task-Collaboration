import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  ...(process.env.VERCEL
    ? {}
    : {
        turbopack: {
          root: path.join(process.cwd(), '../'),
        },
      }),
};

export default withSentryConfig(nextConfig, {
  org: "eap-project-management-task-c",
  project: "javascript-nextjs",
  widenClientFileUpload: true,
  silent: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  errorHandler: (err) => {
    console.warn("Sentry build warning:", err.message);
  },
});
