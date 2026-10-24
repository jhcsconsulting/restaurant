import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server binds 0.0.0.0; browsers open it as 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  // Static export for Cloudflare Pages: `next build` writes HTML/CSS/JS to `out/`.
  output: "export",
  // Static export has no image optimizer; photos in `public/photos` are served as-is.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
