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
  turbopack: {
    root: path.join(process.cwd(), '../'),
  },
};

export default withSentryConfig(nextConfig, {
  org: "eap-project-management-task-c",
  project: "javascript-nextjs",
  widenClientFileUpload: true,
  silent: !process.env.CI,
});
