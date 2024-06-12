/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'multinamespace-rag-renato-namespacedocs-bozznstd.s3.us-east-2.amazonaws.com'
    }]
  }
};

export default nextConfig;
