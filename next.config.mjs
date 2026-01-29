/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      // Add more domains as needed
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.imgur.com",
      },
    ],
    // Allow unoptimized images for development (remove in production)
    // This allows any external image but reduces performance
    // Better to add specific domains above
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
