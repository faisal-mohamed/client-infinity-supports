/** @type {import('next').NextConfig} */
const nextConfig = {
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
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$', '^fdprocessedid$'] } : false,
  },
};

module.exports = nextConfig;
