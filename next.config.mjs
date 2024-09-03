import { Resource } from 'sst';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${Resource.NamespaceDocs.name}.**`
      }
    ]
  }
};

export default nextConfig;
