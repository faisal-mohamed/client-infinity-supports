import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ["src/app", "src/components", "src/lib", "src/hooks", "src/types"],
    // Don't fail build on ESLint errors
    ignoreDuringBuilds: true, // Skip ESLint errors during build
  },
  typescript: {
    // Don't fail build on TypeScript errors during production build
    ignoreBuildErrors: false, // Show TypeScript errors during build
  },
  // This setting helps with hydration mismatches by suppressing the warnings in development
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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/login",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Add externals for @react-pdf/renderer server-side packages
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas',
      });
    }
    
    // Ignore canvas module warnings
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.canvas = false;
    
    return config;
  },
};

export default nextConfig;
