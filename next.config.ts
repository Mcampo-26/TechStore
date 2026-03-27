/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Añadimos las calidades que tus imágenes están solicitando
    qualities: [60, 75, 100], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
};

export default nextConfig;