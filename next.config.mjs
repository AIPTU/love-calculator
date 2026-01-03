/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

const nextConfig = {
  output: "export",
  basePath: repo ? `/${repo}` : "",
  assetPrefix: repo ? `/${repo}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;