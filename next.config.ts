import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
