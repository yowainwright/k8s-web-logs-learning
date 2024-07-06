/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only add the fallback when building for the client-side
    if (!isServer) {
      config.resolve.fallback = {
        child_process: false, // Add the fallback for child_process here
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
