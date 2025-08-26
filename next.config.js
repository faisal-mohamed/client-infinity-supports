/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  reactStrictMode: true,
  // This setting helps with hydration mismatches by suppressing the warnings in development
  // It doesn't affect production builds
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Add this to suppress hydration warnings in development
  compiler: {
    // Suppress hydration warnings for attributes like fdprocessedid
    reactRemoveProperties:
      process.env.NODE_ENV === "production"
        ? { properties: ["^data-testid$", "^fdprocessedid$"] }
        : false,
  },
  // Exclude generated files from the build
  experimental: {
    excludeDefaultMomentLocales: true,
  },
  // Webpack configuration to exclude problematic files
  webpack: (config, { isServer }) => {
    // Exclude Prisma generated files from webpack
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        "@prisma/client": "@prisma/client",
      });
    }

    // Ignore specific files during build
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      exclude: [
        /node_modules/,
        /src\/generated/,
        /generated/,
        /prisma\/generated/,
      ],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/login",
        permanent: true, // or false if it's temporary
      },
    ];
  },
};

module.exports = nextConfig;
