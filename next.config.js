/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['swartdesign.co.za','swartstudio.co.za','limpopochefs.s3.af-south-1.amazonaws.com'],
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
