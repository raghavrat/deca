/** @type {import('next').NextConfig} */
const crypto = require('crypto');

const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    // Handle node: protocol imports with simple aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:stream': 'stream',
      'node:crypto': 'crypto',
      'node:buffer': 'buffer',
      'node:util': 'util',
      'node:fs': 'fs',
      'node:path': 'path',
      'node:url': 'url',
      'node:events': 'events',
      'node:os': 'os',
      'node:process': 'process',
      'node:querystring': 'querystring',
      'node:zlib': 'zlib',
      'node:http': 'http',
      'node:https': 'https',
      'node:assert': 'assert',
      'node:net': 'net',
      'node:tls': 'tls',
      'node:timers': 'timers',
      'node:string_decoder': 'string_decoder',
    }

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 90000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            priority: 20
          },
          lib: {
            test(module) {
              return module.size() > 50000 &&
                /node_modules[/\\]/.test(module.identifier())
            },
            name(module) {
              const hash = crypto.createHash('sha1')
              hash.update(module.identifier())
              return 'lib-' + hash.digest('hex').substring(0, 8)
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          }
        }
      }
    }
    return config
  },
  compress: true
}

module.exports = nextConfig