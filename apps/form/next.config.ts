// next.config.ts
import type { NextConfig } from "next";

const shouldUsePolling = process.env.NEXT_FORCE_POLLING === "true";

const nextConfig: NextConfig = {
  turbopack: {
    // 必要ならローダーを定義
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Webpack モード用（必要なら）
  webpack(config) {
    if (shouldUsePolling) {
      config.watchOptions = {
        ignored: [/node_modules/, /\.next/],
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
