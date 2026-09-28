/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tech-inject/ui', '@tech-inject/types', '@tech-inject/validation'],
};

module.exports = nextConfig;
