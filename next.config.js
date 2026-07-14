/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
