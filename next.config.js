/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Cloudflare Pages, we use standard Next.js build
  // No need for 'output: export' as Cloudflare Pages supports Next.js runtime
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
