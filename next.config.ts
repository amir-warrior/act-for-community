import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    // Decap CMS lives in /public/admin — make /admin open it.
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default nextConfig;
