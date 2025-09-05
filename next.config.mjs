/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure rewrites to handle lookup API routes
  async rewrites() {
    return [
      {
        source: '/lookup/api/:path*',
        destination: '/lookup/api/:path*',
      },
    ];
  },
};

export default nextConfig;
