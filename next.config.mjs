/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/:path*', has: [{ type: 'host', value: 'www.tejbricks.com' }], destination: 'https://tejbricks.com/:path*', permanent: true }];
  },
  ...(process.env.TEJ_BUILD_LOW_RESOURCE === '1' && {
    experimental: {
      cpus: 1,
      memoryBasedWorkersCount: false,
    },
  }),
};

export default nextConfig;
