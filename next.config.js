/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ["src/app", "src/components", "src/lib", "src/hooks", "src/types"],
  },
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
