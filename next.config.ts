import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Esto permite que next/image procese los logos externos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vectorstock.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.ftuc1-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
      },
    ],
    // Optimización extra: permite formatos modernos que pesan menos
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;