/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // Mengekspos ke klien
  },
  images: {
    domains: ['mnyziu33qakbhpjn.public.blob.vercel-storage.com'], // Add your image's hostname here
  },
};


export default nextConfig;
