/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@launchdarkly/toolbar'],
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Handle ESM modules properly
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    return config;
  },
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

module.exports = nextConfig;
