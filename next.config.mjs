/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'multinamespace-rag-dev-namespacedocs-tnosbrms.s3.us-east-2.amazonaws.com'
    }]
  }
};

export default nextConfig;
