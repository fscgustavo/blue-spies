/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
