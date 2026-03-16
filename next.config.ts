/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // <--- Esto permite CUALQUIER dominio
      },
    ],
  },
};

export default nextConfig;