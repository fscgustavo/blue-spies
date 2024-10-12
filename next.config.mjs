/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bsky.social',
        port: '',
      },
    ],
  },
};

export default nextConfig;
