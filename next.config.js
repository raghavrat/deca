/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }

    return config
  },
  compress: true,
}

module.exports = {
    compress: true,
    webpack: (config) => {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 20000000 // 20MB
      }
      return config
    }
  }