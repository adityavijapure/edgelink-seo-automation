/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['cheerio', 'bullmq', 'ioredis'],
  },
}

module.exports = nextConfig
