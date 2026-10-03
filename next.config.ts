import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default withPayload(nextConfig);
