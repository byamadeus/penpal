/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages
  // This generates a fully static site in the 'out' directory
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
