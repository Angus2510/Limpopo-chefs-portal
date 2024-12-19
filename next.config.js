/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["limpopochefs.s3.af-south-1.amazonaws.com", "swartstudio.co.za"],
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
};

module.exports = nextConfig;
