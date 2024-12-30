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
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 400000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              maxSize: 400000
            },
          },
        },
      }
      return config
    }
  }