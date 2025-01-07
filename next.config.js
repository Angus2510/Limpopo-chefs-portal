/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for development

  images: {
    domains: [
      "limpopochefs.s3.af-south-1.amazonaws.com", // Your S3 bucket
      "avatars.githubusercontent.com", // GitHub avatars
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  env: {
    // MongoDB URI for server-side connection
    MONGODB_URI: process.env.DATABASE_URI,
    // Add other environment variables here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Public API URL (for client-side requests)
  },

  // Additional Next.js configuration settings
  webpack(config) {
    // Add custom webpack configurations if necessary
    return config;
  },
};

module.exports = nextConfig;
