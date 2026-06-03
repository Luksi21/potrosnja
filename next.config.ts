import type { NextConfig } from "next";

// On GitHub Pages this is a project site served from a sub-path
// (https://luksi21.github.io/potrosnja/). The CI workflow sets
// NEXT_PUBLIC_BASE_PATH=/potrosnja; locally it is empty so dev runs at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // fully static — required by GitHub Pages, no server logic
  basePath,
  trailingSlash: true, // emit dir/index.html so Pages serves clean deep-links
  images: { unoptimized: true }, // next/image optimizer is unavailable under export
  reactStrictMode: true,
};

export default nextConfig;
