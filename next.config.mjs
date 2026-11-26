/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.TEJ_BUILD_LOW_RESOURCE === '1' && {
    experimental: {
      cpus: 1,
      memoryBasedWorkersCount: false,
    },
  }),
};

export default nextConfig;
